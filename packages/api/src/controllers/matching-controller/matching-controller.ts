import { Response, Router } from 'express';
import { AbstractController } from '../abstract-controller';
import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import { auth } from '../../middlewares/auth';
import { UserRequest } from '../../types/requests';
import { MatchingService } from '../../services/matching-service/matching-service';

@singleton()
export class MatchingController extends AbstractController {
    constructor(private readonly matchingService: MatchingService) {
        super('/matching');
    }

    protected configureRouter(router: Router): void {
        router.post(
            '/like/:userId',
            auth,
            async (
                req: UserRequest<{ userId: string }>,
                res: Response,
                next,
            ) => {
                try {
                    await this.matchingService.swipeUser(
                        req.body.session.user.userId,
                        Number(req.params.userId),
                        true,
                    );
                    res.status(StatusCodes.NO_CONTENT).send();
                } catch (error) {
                    next(error);
                }
            },
        );

        router.post(
            '/dislike/:userId',
            auth,
            async (
                req: UserRequest<{ userId: string }>,
                res: Response,
                next,
            ) => {
                try {
                    await this.matchingService.swipeUser(
                        req.body.session.user.userId,
                        Number(req.params.userId),
                        false,
                    );
                    res.status(StatusCodes.NO_CONTENT).send();
                } catch (error) {
                    next(error);
                }
            },
        );

        router.post(
            '/unmatch/:userId',
            auth,
            async (
                req: UserRequest<{ userId: string }>,
                res: Response,
                next,
            ) => {
                try {
                    await this.matchingService.unmatchUser(
                        req.body.session.user.userId,
                        Number(req.params.userId),
                    );
                    res.status(StatusCodes.NO_CONTENT).send();
                } catch (e) {
                    next(e);
                }
            },
        );
    }
}
