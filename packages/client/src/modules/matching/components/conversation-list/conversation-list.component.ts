import { Component, Input } from '@angular/core';
import { MatchListItemClass } from '../../models/match-list-item';
import { UserProfileService } from 'src/modules/user-profile/services/user-profile-service/user-profile.service';

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
}
