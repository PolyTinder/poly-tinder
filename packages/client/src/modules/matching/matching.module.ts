import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchesPageComponent } from './pages/matches-page/matches-page.component';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { SwipingPageComponent } from './pages/swiping-page/swiping-page.component';
import { UiModule } from '../ui/ui.module';

@NgModule({
    declarations: [MatchesPageComponent, SwipingPageComponent],
    imports: [CommonModule, UserProfileModule, UiModule],
    exports: [MatchesPageComponent],
})
export class MatchingModule {}
