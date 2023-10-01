import { Component, Input } from '@angular/core';
import { MatchListItemClass } from '../../models/match-list-item';

@Component({
    selector: 'app-match-list',
    templateUrl: './match-list.component.html',
    styleUrls: ['./match-list.component.scss'],
})
export class MatchListComponent {
    @Input() matches: MatchListItemClass[] | null = [];
}
