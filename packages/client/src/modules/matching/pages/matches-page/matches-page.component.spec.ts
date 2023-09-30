import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchesPageComponent } from './matches-page.component';

describe('MatchesPageComponent', () => {
    let component: MatchesPageComponent;
    let fixture: ComponentFixture<MatchesPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MatchesPageComponent],
        });
        fixture = TestBed.createComponent(MatchesPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
