import { Component } from '@angular/core';
import { map } from 'rxjs';
import { AuthService } from 'src/modules/auth/services/auth.service';
import { UserService } from 'src/modules/user/services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'admin';

  constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

  get isLoggedIn() {
    return this.userService.isLoggedIn;
  }

  get user() {
    return this.userService.session.pipe(map((session) => session?.user));
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
