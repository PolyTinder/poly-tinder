import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class MatchingService {
    constructor(private readonly http: HttpClient) {}

    likeUser(userAliasId: string) {
        return this.http.post(`/matching/like/${userAliasId}`, {});
    }

    dislikeUser(userAliasId: string) {
        return this.http.post(`/matching/dislike/${userAliasId}`, {});
    }
}
