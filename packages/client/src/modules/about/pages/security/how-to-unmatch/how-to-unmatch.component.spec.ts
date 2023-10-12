import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToUnmatchComponent } from './how-to-unmatch.component';

describe('HowToUnmatchComponent', () => {
  let component: HowToUnmatchComponent;
  let fixture: ComponentFixture<HowToUnmatchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HowToUnmatchComponent]
    });
    fixture = TestBed.createComponent(HowToUnmatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
