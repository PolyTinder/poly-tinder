import {
    Meta,
    StoryObj,
    applicationConfig,
    moduleMetadata,
} from '@storybook/angular';
import { ConversationListComponent } from '../components/conversation-list/conversation-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatchingService } from '../services/matching-service/matching.service';
import { ModerationService } from 'src/modules/moderation/services/moderation.service';
import { MatDialogModule } from '@angular/material/dialog';
import { PublicProfileService } from '../services/public-profile-service/public-profile.service';
import { ValidationService } from 'src/modules/validation/services/validation.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ModalService } from 'src/modules/modals/services/modal.service';
import { MatchListItemClass } from '../models/match-list-item';
import { of } from 'rxjs';
import { UiModule } from 'src/modules/ui/ui.module';
import { MatMenuModule } from '@angular/material/menu';
import { RouterTestingModule } from '@angular/router/testing';
import { provideAnimations } from '@angular/platform-browser/animations';

const meta: Meta<ConversationListComponent> = {
    title: 'Matching/Conversation List',
    component: ConversationListComponent,
    decorators: [
        applicationConfig({
            providers: [provideAnimations()],
        }),
        moduleMetadata({
            imports: [
                RouterTestingModule.withRoutes([
                    { path: '**', component: ConversationListComponent },
                ]),
                HttpClientTestingModule,
                MatDialogModule,
                MatSnackBarModule,
                MatMenuModule,
                UiModule,
            ],
            providers: [
                MatchingService,
                ModerationService,
                PublicProfileService,
                ValidationService,
                ModalService,
            ],
        }),
    ],
};

export default meta;
type Story = StoryObj<ConversationListComponent>;

export const Default: Story = {
    args: {
        conversations: [
            {
                value: of({
                    userId: 0,
                    name: 'John Doe',
                    pictures: [
                        'https://ucarecdn.com/890d60d3-21aa-42f6-9124-3ca0da561f4b/-/crop/626x834/252,0/-/preview/',
                    ],
                }),
                queryInfo: {
                    messagesCount: 0,
                    unreadMessagesCount: 0,
                    lastMessage: 'Last message sent by me',
                    lastMessageAuthorId: 1,
                    lastMessageTimestamp: new Date(),
                },
            },
            {
                value: of({
                    userId: 2,
                    name: 'Jane Doe',
                }),
                queryInfo: {
                    messagesCount: 0,
                    unreadMessagesCount: 0,
                    lastMessage: 'Last message sent user',
                    lastMessageAuthorId: 2,
                    lastMessageTimestamp: new Date(),
                },
            },
        ] as MatchListItemClass[],
    },
};

export const Empty: Story = {
    args: {
        conversations: [],
    },
};
