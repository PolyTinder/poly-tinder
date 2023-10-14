import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesPageComponent } from './pages/matches-page/matches-page.component';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { SwipingPageComponent } from './pages/swiping-page/swiping-page.component';
import { UiModule } from '../ui/ui.module';
import { MatchListComponent } from './components/match-list/match-list.component';
import { MatchedUserPageComponent } from './pages/matched-user-page/matched-user-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatchedModalComponent } from './components/matched-modal/matched-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ConversationListComponent } from './components/conversation-list/conversation-list.component';
import { MatMenuModule } from '@angular/material/menu';
import { ModalsModule } from '../modals/modals.module';
import { ModerationModule } from '../moderation/moderation.module';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations: [
        MatchesPageComponent,
        SwipingPageComponent,
        MatchListComponent,
        MatchedUserPageComponent,
        MatchedModalComponent,
        ConversationListComponent,
    ],
    imports: [
        CommonModule,
        RouterModule,
        MatDialogModule,
        ReactiveFormsModule,
        UserProfileModule,
        UiModule,
        MatMenuModule,
        ModalsModule,
        ModerationModule,
    ],
    exports: [MatchesPageComponent, MatchedUserPageComponent],
})
export class MatchingModule {}
