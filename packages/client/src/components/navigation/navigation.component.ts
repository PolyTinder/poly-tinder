import { Component } from '@angular/core';
import { map } from 'rxjs';
import { AuthenticationService } from 'src/modules/authentication/services/authentication-service/authentication.service';
import { SessionService } from 'src/modules/authentication/services/session-service/session.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
    constructor(private readonly authenticationService: AuthenticationService, private readonly sessionService: SessionService) {}

    get user() {
        return this.sessionService.session$.pipe(map((session) => session?.user));
    }

    logout() {
        this.authenticationService.logout().subscribe();
    }
}
