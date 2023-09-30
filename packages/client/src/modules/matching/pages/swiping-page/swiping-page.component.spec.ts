import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwipingPageComponent } from './swiping-page.component';

describe('SwipingPageComponent', () => {
    let component: SwipingPageComponent;
    let fixture: ComponentFixture<SwipingPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SwipingPageComponent],
        });
        fixture = TestBed.createComponent(SwipingPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
