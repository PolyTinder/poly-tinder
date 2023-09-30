import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileFormComponent } from './user-profile-form.component';

describe('UserProfileFormComponent', () => {
  let component: UserProfileFormComponent;
  let fixture: ComponentFixture<UserProfileFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserProfileFormComponent]
    });
    fixture = TestBed.createComponent(UserProfileFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
