import { HttpClient } from '@angular/common/http';
import {
    NotLoadedPublicUserResult,
    PublicUserResult,
} from 'common/models/user';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

export interface NotLoadedPublicUserResultClass {
    get value(): NotLoadedPublicUserResult;
}

export interface LoadedPublicUserResultClass {
    get value(): PublicUserResult;
}

export class PublicUserResultClass {
    private id: number;
    private value$: BehaviorSubject<
        NotLoadedPublicUserResult | PublicUserResult
    >;
    private loaded$: BehaviorSubject<boolean>;

    constructor(
        notLoadedValue: NotLoadedPublicUserResult,
        private readonly http: HttpClient,
    ) {
        this.id = notLoadedValue.userId;
        this.value$ = new BehaviorSubject<
            NotLoadedPublicUserResult | PublicUserResult
        >(notLoadedValue);
        this.loaded$ = new BehaviorSubject<boolean>(false);
        this.fetch();
    }

    getId(): number {
        return this.id;
    }

    get value() {
        return this.value$.asObservable();
    }

    get loaded() {
        return this.loaded$.asObservable();
    }

    get currentValue() {
        return this.value$.value;
    }

    get currentLoadedValue() {
        if (!this.loaded$.value) {
            throw new Error('Cannot get loaded value when not loaded');
        }

        return this.value$.value;
    }

    tryGetLoadedValue(): Observable<PublicUserResult | null> {
        return combineLatest([this.value, this.loaded]).pipe(
            map(([value, loaded]) => {
                return loaded ? (value as PublicUserResult) : null;
            })
        );
    }

    getNotLoadedValue(): Observable<NotLoadedPublicUserResult | null> {
        return combineLatest([this.value, this.loaded]).pipe(
            map(([value, loaded]) => {
                return loaded ? null : value;
            })
        );
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
