import { Component } from '@angular/core';
import { StateService } from 'src/services/state-service/state.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'client';

    constructor(private readonly stateService: StateService) {}

    get state() {
        return this.stateService.state$;
    }
}
