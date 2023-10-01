import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap, tap } from 'rxjs';
import { TypeOfId } from 'common/types/id';
import { User } from 'common/models/user';
import { Message } from 'common/models/message';
import { HttpClient } from '@angular/common/http';
import { SessionService } from 'src/modules/authentication/services/session-service/session.service';
import { WsService } from 'src/services/ws-service/ws.service';

@Injectable({
    providedIn: 'root',
})
export class MessagesService {
    private messages$: BehaviorSubject<Map<TypeOfId<User>, Message[]>> =
        new BehaviorSubject(new Map());

    constructor(
        private readonly http: HttpClient,
        private readonly sessionService: SessionService,
        private readonly wsService: WsService,
    ) {
        this.wsService.listen('message:new').subscribe((message) => {
            this.messages$.next(
                this.messages$.value.set(message.senderId, [
                    ...(this.messages$.value.get(message.senderId) ?? []),
                    message,
                ]),
            );
        });
    }

    getMessages(userId: TypeOfId<User>): Observable<Message[]> {
        return this.messages$.pipe(
            switchMap((messages) =>
                messages.has(userId)
                    ? of(messages.get(userId)!)
                    : this.fetchMessages(userId),
            ),
        );
    }

    sendMessage(userId: TypeOfId<User>, content: string): Observable<void> {
        this.messages$.next(
            this.messages$.value.set(userId, [
                ...(this.messages$.value.get(userId) ?? []),
                {
                    content,
                    recipientId: userId,
                    senderId:
                        this.sessionService.getCurrentSession().user.userId,
                    timestamp: new Date(),
                    read: false,
                },
            ]),
        );

        return this.http.post<void>('/messages', {
            recipientId: userId,
            content,
        });
    }

    markAsRead(userId: TypeOfId<User>): Observable<void> {
        return this.http.post<void>(`/messages/read/${userId}`, {});
    }

    private fetchMessages(userId: TypeOfId<User>): Observable<Message[]> {
        return this.http.get<Message[]>(`/messages/${userId}`).pipe(
            tap((messages) => {
                this.messages$.next(this.messages$.value.set(userId, messages));
            }),
        );
    }
}
