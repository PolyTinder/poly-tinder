import { TestBed } from '@angular/core/testing';

import { ModerationService } from './moderation.service';

describe('ModerationService', () => {
    let service: ModerationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ModerationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
