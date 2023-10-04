import { Response, Router } from 'express';
import { AbstractController } from '../abstract-controller';
import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import { ModerationService } from '../../services/moderation-service/moderation-service';
import { auth } from '../../middlewares/auth';
import { UserRequest } from '../../types/requests';
import { Report } from 'common/models/moderation';

@singleton()
export class ModerationController extends AbstractController {
    constructor(private readonly moderationService: ModerationService) {
        super('/moderation');
    }

    protected configureRouter(router: Router): void {
        router.post(
            '/block/:userId',
            auth,
            async (
                req: UserRequest<{ userId: string }>,
                res: Response,
                next,
            ) => {
                try {
                    await this.moderationService.blockUser({
                        blockingUserId: req.body.session.user.userId,
                        blockedUserId: Number(req.params.userId),
                    });
                    res.status(StatusCodes.NO_CONTENT).send();
                } catch (e) {
                    next(e);
                }
            },
        );

        router.post(
            '/report/:userId',
            auth,
            async (
                req: UserRequest<
                    { userId: string },
                    Pick<Report, 'reportType' | 'description'>
                >,
                res: Response,
                next,
            ) => {
                try {
                    await this.moderationService.reportUser({
                        reportingUserId: req.body.session.user.userId,
                        reportedUserId: Number(req.params.userId),
                        reportType: req.body.reportType,
                        description: req.body.description,
                    });
                    res.status(StatusCodes.NO_CONTENT).send();
                } catch (e) {
                    next(e);
                }
            },
        );
    }
}
