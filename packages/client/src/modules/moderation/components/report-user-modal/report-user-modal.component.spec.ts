import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportUserModalComponent } from './report-user-modal.component';

describe('ReportUserModalComponent', () => {
  let component: ReportUserModalComponent;
  let fixture: ComponentFixture<ReportUserModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReportUserModalComponent]
    });
    fixture = TestBed.createComponent(ReportUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
