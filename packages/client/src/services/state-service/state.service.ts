import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { State } from 'src/constants/states';

@Injectable({
    providedIn: 'root',
})
export class StateService {
    private state$ = new BehaviorSubject<State>(State.LOADING);
    private error$ = new BehaviorSubject<string | undefined>(undefined);

    constructor() {}

    setReady() {
        this.state$.next(State.READY);
    }

    setError(error: string) {
        this.error$.next(error);
        this.state$.next(State.ERROR);
    }

    setLoading() {
        this.state$.next(State.LOADING);
    }

    get state() {
        return this.state$.asObservable();
    }

    get error() {
        return this.error$.asObservable();
    }
}
