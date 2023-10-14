import {
    Meta,
    StoryObj,
    applicationConfig,
    componentWrapperDecorator,
} from '@storybook/angular';
import { UserProfileCardComponent } from '../components/user-profile-card/user-profile-card.component';
import { MatDialogModule } from '@angular/material/dialog';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const meta: Meta<UserProfileCardComponent> = {
    title: 'User Profile/Card',
    component: UserProfileCardComponent,
    decorators: [
        applicationConfig({
            providers: [
                importProvidersFrom(MatDialogModule),
                importProvidersFrom(MatSnackBarModule),
                importProvidersFrom(HttpClientModule),
            ],
        }),
        componentWrapperDecorator(
            (story) =>
                `<div style="max-width: 400px; height: 600px;">${story}</div>`,
        ),
    ],
    args: {
        userProfile: {
            userId: 0,
            name: 'John Doe',
            age: 22,
            bio: 'Hello, I am John Doe',
            pictures: [
                'https://ucarecdn.com/890d60d3-21aa-42f6-9124-3ca0da561f4b/-/crop/626x834/252,0/-/preview/',
                'https://ucarecdn.com/890d60d3-21aa-42f6-9124-3ca0da561f4b/-/crop/626x834/252,0/-/preview/',
                'https://ucarecdn.com/890d60d3-21aa-42f6-9124-3ca0da561f4b/-/crop/626x834/252,0/-/preview/',
                'https://ucarecdn.com/890d60d3-21aa-42f6-9124-3ca0da561f4b/-/crop/626x834/252,0/-/preview/',
                'https://ucarecdn.com/890d60d3-21aa-42f6-9124-3ca0da561f4b/-/crop/626x834/252,0/-/preview/',
                'https://ucarecdn.com/890d60d3-21aa-42f6-9124-3ca0da561f4b/-/crop/626x834/252,0/-/preview/',
            ],
            interests: ['Dogs', 'Taylor Swift'],
            associations: ['PolyRad', 'Poly-Hab'],
            program: 'bacc_log',
            height: 186,
            lookingFor: 'ltst',
            relationshipType: 'mono',
            zodiacSign: 'cancer',
            drinking: 'never',
            smoking: 'never',
            drugs: 'never',
            workout: 'sometimes',
            jobTitle: 'Barista',
            jobCompany: 'Starbucks',
            livingIn: 'Montreal',
            gender: 'Man',
            genderCategory: 'other',
            genderPreference: 'all',
            sexualOrientation: 'Queer',
        },
    },
    render: (args) => ({
        props: args,
        template: `
            <app-user-profile-card
                [userProfile]="userProfile"
                style="width: 100%; height: 100%;"
            ></app-user-profile-card>
        `,
    }),
};

export default meta;
type Story = StoryObj<UserProfileCardComponent>;

export const Default: Story = {};

export const Minimal: Story = {
    args: {
        userProfile: {
            userId: 0,
            name: 'John Doe',
            age: 22,
            bio: 'Hello, I am John Doe',
            pictures: [
                'https://ucarecdn.com/890d60d3-21aa-42f6-9124-3ca0da561f4b/-/crop/626x834/252,0/-/preview/',
            ],
            genderCategory: 'other',
            genderPreference: 'all',
        },
    },
};
