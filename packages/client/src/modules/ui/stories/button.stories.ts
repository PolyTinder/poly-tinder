import { Meta, StoryObj, componentWrapperDecorator } from '@storybook/angular';
import { ButtonComponent } from '../components/button/button.component';

type StoryType = ButtonComponent & { content: string };

const meta: Meta<StoryType> = {
    title: 'UI/Button',
    component: ButtonComponent,
    argTypes: {
        color: {
            control: 'select',
            options: ['primary', 'default', 'transparent', 'danger'],
        },
        interactable: {
            control: 'select',
            options: ['default', 'large', 'small', 'none'],
        },
    },
    args: {
        content: 'This is a button',
        color: 'default',
        disabled: false,
        icon: 'fas fa-flag',
        iconOnly: false,
        isLoading: false,
        shadow: false,
        interactable: 'small',
    },
    decorators: [
        componentWrapperDecorator(
            (story) => `<div style="display: flex;">${story}</div>`,
        ),
    ],
    render: (args: StoryType) => ({
        props: args,
        template: `
            <app-button
                link="/about"
                [color]="color"
                [disabled]="disabled"
                [icon]="icon"
                [iconOnly]="iconOnly"
                [isLoading]="isLoading"
                [shadow]="shadow"
                [interactable]="interactable"
            >
                ${args.content}
            </app-button>
        `,
    }),
};

export default meta;
type Story = StoryObj<StoryType>;

export const Default: Story = {};

export const Primary: Story = {
    args: {
        color: 'primary',
    },
};

export const Loading: Story = {
    args: {
        isLoading: true,
    },
};
