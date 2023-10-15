import { Meta, StoryObj } from '@storybook/angular';
import { StatusPageComponent } from 'src/components/status-page/status-page.component';

const meta: Meta<StatusPageComponent> = {
    title: 'Status Page',
    component: StatusPageComponent,
    parameters: {
        layout: 'fullscreen',
    },
    args: {
        message: 'Loading...',
        isLoading: true,
        isError: false,
    },
};

export default meta;
type Story = StoryObj<StatusPageComponent>;

export const Loading: Story = {};

export const Error: Story = {
    args: {
        isLoading: false,
        isError: true,
        message: 'Error!',
    },
};
