import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { MatchListComponent } from '../components/match-list/match-list.component';
import { UiModule } from 'src/modules/ui/ui.module';
import { MatchListItemClass } from '../models/match-list-item';
import { of } from 'rxjs';

const meta: Meta<MatchListComponent> = {
    title: 'Matching/Match List',
    component: MatchListComponent,
    decorators: [
        moduleMetadata({
            imports: [UiModule],
        }),
    ],
};

export default meta;
type Story = StoryObj<MatchListComponent>;

export const Default: Story = {
    args: {
        matches: [
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
        matches: [],
    },
};
