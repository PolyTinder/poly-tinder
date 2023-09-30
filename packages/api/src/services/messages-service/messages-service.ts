import { singleton } from 'tsyringe';
import { DatabaseService } from '../database-service/database-service';
import { Knex } from 'knex';
import { Message } from 'common/models/message';
import { MatchingService } from '../matching-service/matching-service';

@singleton()
export class MessagesService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly matchingService: MatchingService,
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

        this.messages.insert({
            senderId,
            recipientId,
            content,
        });
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

        return this.messages
            .select()
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
            .offset(offset);
    }
}
