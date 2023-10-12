import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentPageComponent } from './consent-page.component';

describe('ConsentPageComponent', () => {
  let component: ConsentPageComponent;
  let fixture: ComponentFixture<ConsentPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsentPageComponent]
    });
    fixture = TestBed.createComponent(ConsentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
