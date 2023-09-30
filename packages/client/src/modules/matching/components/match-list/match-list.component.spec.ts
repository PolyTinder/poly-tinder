import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchListComponent } from './match-list.component';

describe('MatchListComponent', () => {
    let component: MatchListComponent;
    let fixture: ComponentFixture<MatchListComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MatchListComponent],
        });
        fixture = TestBed.createComponent(MatchListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
