import { Router } from 'express';
import { AbstractController } from '../abstract-controller';
import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import { ModerationService } from '../../services/moderation-service/moderation-service';

@singleton()
export class AdminModerationController extends AbstractController {
    constructor(private readonly moderationService: ModerationService) {
        super('/admin/moderation');
    }

    protected configureRouter(router: Router): void {
        router.get('/', async (req, res) => {
            res.status(StatusCodes.OK).json({ hello: 'world!' });
        });
    }
}
