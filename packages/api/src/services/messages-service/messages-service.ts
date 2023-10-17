import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { Message } from 'common/models/message';
import { MatchingService } from '../matching-service/matching-service';
import { WsService } from '../ws-service/ws-service';
import { ModerationService } from '../moderation-service/moderation-service';
import { HttpException } from '../../models/http-exception';
import { StatusCodes } from 'http-status-codes';

@singleton()
export class MessagesService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly matchingService: MatchingService,
        private readonly moderationService: ModerationService,
        private readonly wsService: WsService,
    ) {}

    private get messages(): Knex.QueryBuilder<Message> {
        return this.databaseService.database('messages');
    }

    /**
     * Send a message to a user
     *
     * @param senderId ID of the user sending the message
     * @param recipientId ID of the user receiving the message
     * @param content Content of the message
     */
    async sendMessage(
        senderId: number,
        recipientId: number,
        content: string,
    ): Promise<void> {
        if (!(await this.matchingService.areMatched(senderId, recipientId))) {
            throw new Error('Cannot send message to unmatched user');
        }
        if (await this.moderationService.isBlocked(senderId, recipientId)) {
            throw new Error('Cannot send message');
        }
        if (await this.moderationService.isBannedOrSuspended(senderId)) {
            throw new HttpException(
                'You are banned or suspended',
                StatusCodes.LOCKED,
            );
        }
        if (await this.moderationService.isBannedOrSuspended(recipientId)) {
            throw new HttpException(
                'You cannot interact with a user who is banned or suspended',
                StatusCodes.LOCKED,
            );
        }
        const message: Message = {
            senderId,
            recipientId,
            content,
            timestamp: new Date(),
            read: false,
        };

        await this.messages.insert(message);

        this.wsService.emitToUserIfConnected(
            recipientId,
            'message:new',
            message,
        );
    }

    /**
     * Get messages between two users
     *
     * @param userId ID of the user requesting the messages
     * @param otherUserId ID of the other user
     * @param limit Maximum number of messages to get
     * @param offset Number of messages to skip
     * @returns Messages between the two users
     */
    async getMessages(
        userId: number,
        otherUserId: number,
        limit: number,
        offset: number,
    ): Promise<Message[]> {
        if (!(await this.matchingService.areMatched(userId, otherUserId))) {
            throw new Error('Cannot get messages with unmatched user');
        }
        if (await this.moderationService.isBannedOrSuspended(userId)) {
            throw new HttpException(
                'You are banned or suspended',
                StatusCodes.LOCKED,
            );
        }
        if (await this.moderationService.isBannedOrSuspended(otherUserId)) {
            throw new HttpException(
                'You cannot interact with a user who is banned or suspended',
                StatusCodes.LOCKED,
            );
        }

        const messages: Message[] = (await this.messages
            .select('*')
            .where((builder) =>
                builder
                    .where({
                        senderId: userId,
                        recipientId: otherUserId,
                    })
                    .orWhere({
                        senderId: otherUserId,
                        recipientId: userId,
                    }),
            )
            .orderBy('timestamp', 'desc')
            .limit(limit)
            .offset(offset)) as unknown as Message[];

        return messages.reverse();
    }

    /**
     * Mark messages between two users as read
     *
     * @param userId ID of the user marking the messages as read
     * @param otherUserId ID of the other user
     */
    async markAsRead(userId: number, otherUserId: number): Promise<void> {
        if (!(await this.matchingService.areMatched(userId, otherUserId))) {
            throw new Error('Cannot mark messages as read with unmatched user');
        }

        await this.messages
            .update({ read: true })
            .where({ senderId: otherUserId, recipientId: userId });
    }
}
