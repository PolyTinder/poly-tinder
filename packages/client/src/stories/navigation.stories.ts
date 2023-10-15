import {
    Meta,
    StoryObj,
    componentWrapperDecorator,
    moduleMetadata,
} from '@storybook/angular';
import { NavigationComponent } from 'src/components/navigation/navigation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthenticationService } from 'src/modules/authentication/services/authentication-service/authentication.service';
import { UserProfileService } from 'src/modules/user-profile/services/user-profile-service/user-profile.service';
import { ValidationService } from 'src/modules/validation/services/validation.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PublicProfileService } from 'src/modules/matching/services/public-profile-service/public-profile.service';
import { UiModule } from 'src/modules/ui/ui.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SessionService } from 'src/modules/authentication/services/session-service/session.service';
import { of } from 'rxjs';

const meta: Meta<NavigationComponent> = {
    title: 'Navigation',
    component: NavigationComponent,
    decorators: [
        moduleMetadata({
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                MatSnackBarModule,
                UiModule,
            ],
            providers: [
                AuthenticationService,
                UserProfileService,
                ValidationService,
                PublicProfileService,
            ],
        }),
        componentWrapperDecorator(
            (story) => `<div style="height: 100vh;">${story}</div>`,
        ),
    ],
    parameters: {
        layout: 'fullscreen',
    },
};

export default meta;
type Story = StoryObj<NavigationComponent>;

export const NotLoggedIn: Story = {
    decorators: [
        moduleMetadata({
            providers: [
                {
                    provide: SessionService,
                    useValue: {
                        isLoggedIn: () => of(false),
                        session: of({}),
                    },
                },
            ],
        }),
    ],
};

export const LoggedIn: Story = {
    decorators: [
        moduleMetadata({
            providers: [
                {
                    provide: SessionService,
                    useValue: {
                        isLoggedIn: () => of(true),
                        session: of({}),
                    },
                },
            ],
        }),
    ],
};
