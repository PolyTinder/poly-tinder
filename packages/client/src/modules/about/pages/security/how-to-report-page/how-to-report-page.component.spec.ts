import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToReportPageComponent } from './how-to-report-page.component';

describe('HowToReportPageComponent', () => {
    let component: HowToReportPageComponent;
    let fixture: ComponentFixture<HowToReportPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [HowToReportPageComponent],
        });
        fixture = TestBed.createComponent(HowToReportPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
