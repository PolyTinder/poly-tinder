import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { Message } from 'common/models/message';
import { MatchingService } from '../matching-service/matching-service';
import { WsService } from '../ws-service/ws-service';

@singleton()
export class MessagesService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly matchingService: MatchingService,
        private readonly wsService: WsService,
    ) {}

    private get messages(): Knex.QueryBuilder<Message> {
        return this.databaseService.database('messages');
    }

    async sendMessage(
        senderId: number,
        recipientId: number,
        content: string,
    ): Promise<void> {
        if (!(await this.matchingService.areMatched(senderId, recipientId))) {
            throw new Error('Cannot send message to unmatched user');
        }

        const message: Message = {
            senderId,
            recipientId,
            content,
            timestamp: new Date(),
            read: false,
        };

        await this.messages.insert(message);

        try {
            await this.wsService.emitToUser(
                recipientId,
                'message:new',
                message,
            );
        } catch {
            // Ignore
        }
    }

    async getMessages(
        userId: number,
        otherUserId: number,
        limit: number,
        offset: number,
    ): Promise<Message[]> {
        if (!(await this.matchingService.areMatched(userId, otherUserId))) {
            throw new Error('Cannot get messages with unmatched user');
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

    async markAsRead(userId: number, otherUserId: number): Promise<void> {
        if (!(await this.matchingService.areMatched(userId, otherUserId))) {
            throw new Error('Cannot mark messages as read with unmatched user');
        }

        await this.messages
            .update({ read: true })
            .where({ senderId: otherUserId, recipientId: userId });
    }
}
