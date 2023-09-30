import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotLoadedPublicUserResult } from 'common/models/user';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { PublicUserResultClass } from '../../models/public-user-result';

@Injectable({
    providedIn: 'root',
})
export class PublicProfileService {
    private matches$: BehaviorSubject<PublicUserResultClass[]> = new BehaviorSubject<PublicUserResultClass[]>([]);

    constructor(private readonly http: HttpClient) {}

    get matches() {
        return this.matches$.asObservable();
    }

    getMatch(id: number) {
        return this.matches.pipe(map((matches) => matches.find((match) => match.getId() === id)));
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

    fetchMatches(): Observable<PublicUserResultClass[]> {
        return this.http
            .get<NotLoadedPublicUserResult[]>('/public-profile/matches')
            .pipe(
                map((users) => {
                    return users.map(
                        (user) => new PublicUserResultClass(user, this.http),
                    );
                }),
                tap((users) => this.matches$.next(users)),
            );
    }
}
