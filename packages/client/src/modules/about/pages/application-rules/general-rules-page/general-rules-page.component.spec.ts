import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralRulesPageComponent } from './general-rules-page.component';

describe('GeneralRulesPageComponent', () => {
  let component: GeneralRulesPageComponent;
  let fixture: ComponentFixture<GeneralRulesPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralRulesPageComponent]
    });
    fixture = TestBed.createComponent(GeneralRulesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
