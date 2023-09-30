import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { NAVIGATION } from 'src/constants/navigation';
import { AuthenticationService } from 'src/modules/authentication/services/authentication-service/authentication.service';
import { SessionService } from 'src/modules/authentication/services/session-service/session.service';
import { UserProfileService } from 'src/modules/user-profile/services/user-profile-service/user-profile.service';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
})
export class NavigationComponent {
    navigation = NAVIGATION;
    collapsed = false;

    constructor(
        private readonly authenticationService: AuthenticationService,
        private readonly sessionService: SessionService,
        private readonly userProfileService: UserProfileService,
        private readonly router: Router,
    ) {}

    get user() {
        return this.sessionService.session$.pipe(
            map((session) => session?.user),
        );
    }
    
    get userProfile() {
        return this.userProfileService.getUserProfile();
    }

    get name() {
        return combineLatest([this.user, this.userProfile]).pipe(map(([user, userProfile]) => {
            return userProfile?.name ?? user?.email ?? '';
        }));
    }

    get avatar() {
        return this.userProfile.pipe(map((userProfile) => {
            const avatar = userProfile?.pictures?.[0] ?? undefined;

            return avatar ? `${avatar}-/scale_crop/100x100/center/` : undefined;
        }));
    }

    logout() {
        this.authenticationService.logout().subscribe();
    }

    isActiveLink(href: string) {
        return this.router.url === href;
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
    }
}
