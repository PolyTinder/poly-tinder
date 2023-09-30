import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchedUserPageComponent } from './matched-user-page.component';

describe('MatchedUserPageComponent', () => {
    let component: MatchedUserPageComponent;
    let fixture: ComponentFixture<MatchedUserPageComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [MatchedUserPageComponent],
        });
        fixture = TestBed.createComponent(MatchedUserPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
