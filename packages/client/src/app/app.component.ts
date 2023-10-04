import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from 'src/services/state-service/state.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'client';

    constructor(
        private readonly stateService: StateService,
        private readonly router: Router,
    ) {}

    get state() {
        return this.stateService.state;
    }

    get error() {
        return this.stateService.error;
    }

    get shouldHideNav() {
        return !!this.router.url.match(/\/matches\/[a-zA-Z0-9-]+/);
    }
}
