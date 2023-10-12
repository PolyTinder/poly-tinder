import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToBlockPageComponent } from './how-to-block-page.component';

describe('HowToBlockPageComponent', () => {
  let component: HowToBlockPageComponent;
  let fixture: ComponentFixture<HowToBlockPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HowToBlockPageComponent]
    });
    fixture = TestBed.createComponent(HowToBlockPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
