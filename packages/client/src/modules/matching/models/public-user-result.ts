import { HttpClient } from '@angular/common/http';
import {
    NotLoadedPublicUserResult,
    PublicUserResult,
} from 'common/models/user';
import { BehaviorSubject } from 'rxjs';

export interface NotLoadedPublicUserResultClass {
    get value(): NotLoadedPublicUserResult;
}

export interface LoadedPublicUserResultClass {
    get value(): PublicUserResult;
}

export class PublicUserResultClass {
    private id: string;
    private value$: BehaviorSubject<
        NotLoadedPublicUserResult | PublicUserResult
    >;
    private loaded$: BehaviorSubject<boolean>;

    constructor(
        notLoadedValue: NotLoadedPublicUserResult,
        private readonly http: HttpClient,
    ) {
        this.id = notLoadedValue.userAliasId;
        this.value$ = new BehaviorSubject<
            NotLoadedPublicUserResult | PublicUserResult
        >(notLoadedValue);
        this.loaded$ = new BehaviorSubject<boolean>(false);
        this.fetch();
    }

    getId(): string {
        return this.id;
    }

    get value() {
        return this.value$.asObservable();
    }

    get loaded() {
        return this.loaded$.asObservable();
    }

    get loadedValue() {
        if (!this.loaded$.value) {
            throw new Error('Cannot get loaded value when not loaded');
        }

        return this.value$.value;
    }

    private fetch() {
        this.http
            .get<PublicUserResult>(`/public-profile/find/${this.id}`)
            .subscribe((user) => {
                this.value$.next(user);
                this.loaded$.next(true);
            });
    }
}
