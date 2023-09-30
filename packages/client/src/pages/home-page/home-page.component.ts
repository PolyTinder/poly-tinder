import { Component } from '@angular/core';
import { AuthenticationService } from 'src/modules/authentication/services/authentication-service/authentication.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent {
    constructor(private readonly authenticationService: AuthenticationService) { }

    logout() {
      this.authenticationService.logout().subscribe();
    }
}
