import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserPublicSession } from 'common/models/authentication'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private session$: BehaviorSubject<UserPublicSession | undefined> = new BehaviorSubject<UserPublicSession | undefined>(undefined);

  constructor() { }

  get session() {
    return this.session$.asObservable();
  }

  setSession(session: UserPublicSession | undefined) {
    if (session) {
      localStorage.setItem('session_token', session.token);
    } else {
      localStorage.removeItem('session_token');
    }

    this.session$.next(session);
  }

  getSavedToken() {
    return localStorage.getItem('session_token');
  }
}
