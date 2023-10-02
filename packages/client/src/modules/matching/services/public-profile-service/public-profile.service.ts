import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotLoadedPublicUserResult } from 'common/models/user';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { PublicUserResultClass } from '../../models/public-user-result';
import { MatchListItem } from 'common/models/matching';
import { MatchListItemClass } from '../../models/match-list-item';
import { WsService } from 'src/services/ws-service/ws.service';

@Injectable({
    providedIn: 'root',
})
export class PublicProfileService {
    private matches$: BehaviorSubject<MatchListItemClass[]> =
        new BehaviorSubject<MatchListItemClass[]>([]);

    constructor(
        private readonly http: HttpClient,
        private readonly wsService: WsService,
    ) {
        this.wsService.listen('message:new').subscribe((message) => {
            const matches = this.matches$.getValue();
            const match = matches.find(
                (match) => match.id === message.senderId,
            );

            if (match) {
                match.queryInfo.lastMessage = message.content;
                match.queryInfo.lastMessageAuthorId = message.senderId;
                match.queryInfo.lastMessageTimestamp = message.timestamp;
                match.queryInfo.messagesCount =
                    (match.queryInfo.messagesCount ?? 0) + 1;
                match.queryInfo.unreadMessagesCount =
                    (match.queryInfo.unreadMessagesCount ?? 0) + 1;

                this.matches$.next(matches);
            }
        });
        this.wsService.listen('match:update-list').subscribe(() => {
            this.fetchMatches().subscribe();
        });

        this.fetchMatches().subscribe();
    }

    get matches() {
        return this.matches$.asObservable();
    }

    get unreadConversationCount(): Observable<string> {
        return this.matches.pipe(
            map((matches) => {
                return matches.reduce((acc, match) => {
                    return acc + match.queryInfo.unreadMessagesCount;
                }, 0);
            }),
            map((count) => (count > 9 ? '+' : `${count}`)),
        );
    }

    getMatch(id: number) {
        return this.matches.pipe(
            map((matches) => matches.find((match) => match.id === id)),
        );
    }

    getAvailableUsers(): Observable<PublicUserResultClass[]> {
        return this.http
            .get<NotLoadedPublicUserResult[]>('/public-profile')
            .pipe(
                map((users) => {
                    return users.map(
                        (user) => new PublicUserResultClass(user, this.http),
                    );
                }),
            );
    }

    fetchMatches(): Observable<MatchListItemClass[]> {
        return this.http.get<MatchListItem[]>('/public-profile/matches').pipe(
            map((users) => {
                return users.map(
                    (user) => new MatchListItemClass(user, this.http),
                );
            }),
            tap((users) => this.matches$.next(users)),
        );
    }

    fetchMatchesIfNotLoaded(): Observable<PublicUserResultClass[]> {
        if (this.matches$.getValue().length === 0) {
            return this.fetchMatches();
        }

        return this.matches;
    }

    // private haveMatchesChanged(matches: PublicUserResultClass[]): boolean {
    //     const currentMatches = this.matches$.getValue();
    //     if (currentMatches.length !== matches.length) {
    //         return true;
    //     }

    //     return matches.some((match) => {
    //         const currentMatch = currentMatches.find(
    //             (currentMatch) => currentMatch.id === match.id,
    //         );

    //         if (!currentMatch) {
    //             return true;
    //         }

    //         return currentMatch.currentValue.userId !== match.id;
    //     });
    // }
}
