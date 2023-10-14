import { Meta, StoryObj } from '@storybook/angular';
import { CardComponent } from '../components/card/card.component';

type StoryType = CardComponent & { content: string };

const meta: Meta<StoryType> = {
    title: 'UI/Card',
    component: CardComponent,
    args: {
        title: 'This is a title',
        icon: 'fas fa-flag',
        content: 'This is a card',
        noPadding: false,
        color: 'default',
    },
    render: (args: StoryType) => ({
        props: args,
        template: `
            <app-card
                [icon]="icon"
                [title]="title"
                [anchor]="anchor"
                [noPadding]="noPadding"
                [color]="color"
            >
                ${args.content}
            </app-card>
        `,
    }),
};

export default meta;
type Story = StoryObj<StoryType>;

export const Default: Story = {};

export const Danger: Story = {
    args: {
        title: undefined,
        icon: undefined,
        content: 'This is a danger card',
        color: 'danger',
    },
};
