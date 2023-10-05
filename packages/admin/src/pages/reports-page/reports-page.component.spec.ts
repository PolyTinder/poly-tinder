import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsPageComponent } from './reports-page.component';

describe('ReportsPageComponent', () => {
  let component: ReportsPageComponent;
  let fixture: ComponentFixture<ReportsPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportsPageComponent]
    });
    fixture = TestBed.createComponent(ReportsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
