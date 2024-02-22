import { singleton } from 'tsyringe';
import { NotificationService } from '../../services/notification-service/notification-service';
import { AbstractController } from '../abstract-controller';
import { Request, Router } from 'express';
import { StatusCodes } from 'http-status-codes';

@singleton()
export class NotificationController extends AbstractController {
    constructor(private readonly notificationService: NotificationService) {
        super('/notification');
    }

    protected configureRouter(router: Router): void {
        router.post(
            '/subscribe',
            async (
                req: Request<{ userId: number; sub: PushSubscription }>,
                res,
                next,
            ) => {
                try {
                    res.status(StatusCodes.OK).json(
                        await this.notificationService.subscribe(
                            req.body.userId,
                            req.body.sub,
                        ),
                    );
                } catch (error) {
                    next(error);
                }
            },
        );

        router.post(
            '/unsubscribe',
            async (req: Request<{ userID: number }>, res, next) => {
                try {
                    res.status(StatusCodes.OK).json(
                        await this.notificationService.unsubscribe(
                            req.body.userID,
                        ),
                    );
                } catch (error) {
                    next(error);
                }
            },
        );
    }
}
