import { Component, Input } from '@angular/core';
import { MatchListItemClass } from '../../models/match-list-item';

@Component({
    selector: 'app-conversation-list',
    templateUrl: './conversation-list.component.html',
    styleUrls: ['./conversation-list.component.scss'],
})
export class ConversationListComponent {
    @Input() conversations: MatchListItemClass[] | null = [];

    onActionsClick(event: MouseEvent) {
        event.stopPropagation();
    }

    formatDate(date: Date): string {
        const now = new Date();
        date = new Date(date);
        const dateStr = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
        const timeStr = `${date.getHours()}:${date.getMinutes()}`;

        return dateStr ===
            `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`
            ? timeStr
            : dateStr;
    }
}
