import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AidOrganizationsPageComponent } from './aid-organizations-page.component';

describe('AidOrganizationsPageComponent', () => {
  let component: AidOrganizationsPageComponent;
  let fixture: ComponentFixture<AidOrganizationsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AidOrganizationsPageComponent]
    });
    fixture = TestBed.createComponent(AidOrganizationsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
