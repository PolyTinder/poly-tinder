import { HttpClient } from '@angular/common/http';
import {
    NotLoadedPublicUserResult,
    PublicUserResult,
} from 'common/models/user';
import { BehaviorSubject, Observable, tap } from 'rxjs';

export interface NotLoadedPublicUserResultClass {
    get value(): NotLoadedPublicUserResult;
}

export interface LoadedPublicUserResultClass {
    get value(): PublicUserResult;
}

export class PublicUserResultClass {
    private value$: BehaviorSubject<PublicUserResult>;
    private loaded$: BehaviorSubject<boolean>;

    constructor(
        initialValue: NotLoadedPublicUserResult,
        private readonly http: HttpClient,
    ) {
        this.value$ = new BehaviorSubject<PublicUserResult>(initialValue);
        this.loaded$ = new BehaviorSubject<boolean>(false);

        this.fetch().subscribe();
    }

    get id(): number {
        return this.value$.value.userId;
    }

    get currentValue(): PublicUserResult {
        return this.value$.value;
    }

    get currentlyLoaded(): boolean {
        return this.loaded$.value;
    }

    get value(): Observable<PublicUserResult> {
        return this.value$.asObservable();
    }

    get loaded(): Observable<boolean> {
        return this.loaded$.asObservable();
    }

    private fetch(): Observable<PublicUserResult> {
        return this.http
            .get<PublicUserResult>(`/public-profile/find/${this.id}`)
            .pipe(
                tap((user) => {
                    this.value$.next(user);
                    this.loaded$.next(true);
                }),
            );
    }
}
