import { Router } from 'express';
import { AbstractController } from '../abstract-controller';
import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import { ModerationService } from '../../services/moderation-service/moderation-service';
import { AdminService } from '../../services/admin-service/admin-service';

@singleton()
export class AdminModerationController extends AbstractController {
    constructor(
        private readonly moderationService: ModerationService,
        private readonly adminService: AdminService,
    ) {
        super('/admin/moderation');
    }

    protected configureRouter(router: Router): void {
        router.get('/reports', async (req, res, next) => {
            try {
                res.status(StatusCodes.OK).json(
                    await this.adminService.getReports(),
                );
            } catch (e) {
                next(e);
            }
        });
    }
}
