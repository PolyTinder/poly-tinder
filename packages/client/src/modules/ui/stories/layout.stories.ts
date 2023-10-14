import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { LayoutComponent } from '../components/layout/layout.component';
import { LayoutActionComponent } from '../components/layout-action/layout-action.component';

type LayoutAction = {
    [K in keyof LayoutActionComponent]?: LayoutActionComponent[K];
};
type StoryType = LayoutComponent & {
    title: string;
    content: string;
    actionsLeft: LayoutAction[];
    actionsRight: LayoutAction[];
};

const meta: Meta<StoryType> = {
    title: 'UI/Layout',
    component: LayoutComponent,
    decorators: [
        moduleMetadata({
            declarations: [LayoutComponent, LayoutActionComponent],
        }),
    ],
    args: {
        title: 'Title',
        content: 'This is the content',
        actionsLeft: [
            {
                icon: 'fas fa-chevron-left',
            },
        ],
        actionsRight: [
            {
                content: 'Action',
            },
            {
                icon: 'fas fa-ellipsis-v',
            },
        ],
    },
    parameters: {
        layout: 'fullscreen',
    },
    render: (args) => ({
        props: args,
        template: `
            <app-layout>
                <span layout-title>{{ title }}</span>

                <app-layout-action
                    layout-action-left
                    *ngFor="let action of actionsLeft"
                    [icon]="action.icon"
                    [content]="action.content"
                    [disabled]="action.disabled"
                    [iconAdjustH]="action.iconAdjustH"
                    [iconAdjustV]="action.iconAdjustV"
                ></app-layout-action>

                <app-layout-action
                    layout-action-right
                    *ngFor="let action of actionsRight"
                    [icon]="action.icon"
                    [content]="action.content"
                    [disabled]="action.disabled"
                    [iconAdjustH]="action.iconAdjustH"
                    [iconAdjustV]="action.iconAdjustV"
                ></app-layout-action>

                <span style="padding: 0 24px;">{{ content }}</span>
            </app-layout>
        `,
    }),
};

export default meta;
type Story = StoryObj<StoryType>;

export const Default: Story = {};
