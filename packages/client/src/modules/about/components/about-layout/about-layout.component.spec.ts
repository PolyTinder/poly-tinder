import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutLayoutComponent } from './about-layout.component';

describe('AboutLayoutComponent', () => {
  let component: AboutLayoutComponent;
  let fixture: ComponentFixture<AboutLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutLayoutComponent]
    });
    fixture = TestBed.createComponent(AboutLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
