import { Component, Input } from '@angular/core';
import { PublicUserResultClass } from '../../models/public-user-result';

@Component({
    selector: 'app-match-list',
    templateUrl: './match-list.component.html',
    styleUrls: ['./match-list.component.scss'],
})
export class MatchListComponent {
    @Input() matches: PublicUserResultClass[] | null = [];
}
