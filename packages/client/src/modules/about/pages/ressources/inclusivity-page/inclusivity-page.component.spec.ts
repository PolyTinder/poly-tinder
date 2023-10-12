import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InclusivityPageComponent } from './inclusivity-page.component';

describe('InclusivityPageComponent', () => {
  let component: InclusivityPageComponent;
  let fixture: ComponentFixture<InclusivityPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InclusivityPageComponent]
    });
    fixture = TestBed.createComponent(InclusivityPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
