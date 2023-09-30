import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class MatchingService {
    constructor(private readonly http: HttpClient) {}

    likeUser(userId: number) {
        return this.http.post(`/matching/like/${userId}`, {});
    }

    dislikeUser(userId: number) {
        return this.http.post(`/matching/dislike/${userId}`, {});
    }
}
