import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotLoadedPublicUserResult } from 'common/models/user';
import { Observable, map } from 'rxjs';
import { PublicUserResultClass } from '../../models/public-user-result';

@Injectable({
    providedIn: 'root',
})
export class PublicProfileService {
    constructor(private readonly http: HttpClient) {}

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

    getMatches(): Observable<PublicUserResultClass[]> {
        return this.http
            .get<NotLoadedPublicUserResult[]>('/public-profile/matches')
            .pipe(
                map((users) => {
                    return users.map(
                        (user) => new PublicUserResultClass(user, this.http),
                    );
                }),
            );
        // const subject = new Subject<(PublicUserResult | NotLoadedPublicUserResult)[]>();

        // this.http.get<NotLoadedPublicUserResult[]>('/public-profile/matches').pipe(map((users) => {
        //     let usersWithLoadedValues: (PublicUserResult | NotLoadedPublicUserResult)[] = users;
        //     subject.next(usersWithLoadedValues);

        //     users.map((user, index) => {
        //         this.http.get<PublicUserResult>(`/public-profile/find/${user.userAliasId}`).subscribe((user) => {
        //             usersWithLoadedValues[index] = user;
        //             subject.next(usersWithLoadedValues);
        //         });
        //     });
        // }));

        // return subject.pipe(debounceTime(1));
    }
}
