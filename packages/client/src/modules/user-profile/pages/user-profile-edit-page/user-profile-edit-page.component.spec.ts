import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileEditPageComponent } from './user-profile-edit-page.component';

describe('UserProfileEditPageComponent', () => {
    let component: UserProfileEditPageComponent;
    let fixture: ComponentFixture<UserProfileEditPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [UserProfileEditPageComponent],
        });
        fixture = TestBed.createComponent(UserProfileEditPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
