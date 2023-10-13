import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationLayoutComponent } from './authentication-layout.component';

describe('AuthenticationLayoutComponent', () => {
  let component: AuthenticationLayoutComponent;
  let fixture: ComponentFixture<AuthenticationLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthenticationLayoutComponent]
    });
    fixture = TestBed.createComponent(AuthenticationLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
