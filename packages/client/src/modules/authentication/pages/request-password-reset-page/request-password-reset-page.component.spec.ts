import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPasswordResetPageComponent } from './request-password-reset-page.component';

describe('RequestPasswordResetPageComponent', () => {
    let component: RequestPasswordResetPageComponent;
    let fixture: ComponentFixture<RequestPasswordResetPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [RequestPasswordResetPageComponent],
        });
        fixture = TestBed.createComponent(RequestPasswordResetPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
