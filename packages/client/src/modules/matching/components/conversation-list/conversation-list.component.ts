import { Component, Input } from '@angular/core';
import { MatchListItemClass } from '../../models/match-list-item';
import { MatchingService } from '../../services/matching-service/matching.service';
import { ModalService } from 'src/modules/modals/services/modal.service';
import { ModerationService } from 'src/modules/moderation/services/moderation.service';

@Component({
    selector: 'app-conversation-list',
    templateUrl: './conversation-list.component.html',
    styleUrls: ['./conversation-list.component.scss'],
})
export class ConversationListComponent {
    @Input() conversations: MatchListItemClass[] | null = [];

    constructor(
        private readonly matchingService: MatchingService,
        private readonly modalService: ModalService,
        private readonly moderationService: ModerationService,
    ) {}

    onActionsClick(event: MouseEvent) {
        event.stopPropagation();
    }

    formatDate(date: Date): string {
        const now = new Date();
        date = new Date(date);
        const dateStr = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
        const timeStr = `${date.getHours()}:${
            (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
        }`;

        return dateStr ===
            `${now.getDate()}/${now.getMonth()}/${now.getFullYear()}`
            ? timeStr
            : dateStr;
    }

    unmatchUser(user: MatchListItemClass) {
        this.matchingService.askUnmatchUser(user);
    }

    reportUser(user: MatchListItemClass) {
        this.moderationService.openReportUserModal(
            user.id,
            user.currentValue.name ?? '',
        );
    }

    blockUser(user: MatchListItemClass) {
        this.moderationService.openBlockUserModal(
            user.id,
            user.currentValue.name ?? '',
        );
    }
}
