import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchedUserProfilePageComponent } from './matched-user-profile-page.component';

describe('MatchedUserProfilePageComponent', () => {
    let component: MatchedUserProfilePageComponent;
    let fixture: ComponentFixture<MatchedUserProfilePageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MatchedUserProfilePageComponent],
        });
        fixture = TestBed.createComponent(MatchedUserProfilePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
