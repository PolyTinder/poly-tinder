import { Router } from 'express';
import { AbstractController } from '../abstract-controller';
import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import { AdminReportsService } from '../../services/admin-reports-service/admin-reports-service';

@singleton()
export class AdminModerationController extends AbstractController {
    constructor(private readonly adminReportsService: AdminReportsService) {
        super('/admin/moderation');
    }

    protected configureRouter(router: Router): void {
        router.get('/reports', async (req, res, next) => {
            try {
                res.status(StatusCodes.OK).json(
                    await this.adminReportsService.getReports(),
                );
            } catch (e) {
                next(e);
            }
        });
    }
}
