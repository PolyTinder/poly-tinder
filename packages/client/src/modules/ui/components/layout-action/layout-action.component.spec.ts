import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutActionComponent } from './layout-action.component';

describe('LayoutActionComponent', () => {
    let component: LayoutActionComponent;
    let fixture: ComponentFixture<LayoutActionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [LayoutActionComponent],
        });
        fixture = TestBed.createComponent(LayoutActionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
