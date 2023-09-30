import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { State } from 'src/constants/states';

@Injectable({
    providedIn: 'root',
})
export class StateService {
    state$ = new BehaviorSubject<State>(State.LOADING);

    constructor() {}
}
