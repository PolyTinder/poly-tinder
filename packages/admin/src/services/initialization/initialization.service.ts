import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from 'src/modules/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class InitializationService {

  constructor(private readonly authService: AuthService) { }

  async init() {
    await lastValueFrom(this.authService.loadSession());
  }
}
