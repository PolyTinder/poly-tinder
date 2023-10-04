import { Response, Router } from 'express';
import { AbstractController } from '../abstract-controller';
import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import { PublicProfileService } from '../../services/public-profile-service/public-profile-service';
import { auth } from '../../middlewares/auth';
import { UserRequest } from '../../types/requests';
import { validateUser } from '../../middlewares/validate-user';

@singleton()
export class PublicProfileController extends AbstractController {
    constructor(private readonly publicProfileService: PublicProfileService) {
        super('/public-profile');
    }

    protected configureRouter(router: Router): void {
        router.get(
            '/',
            auth,
            validateUser,
            async (req: UserRequest, res: Response, next) => {
                try {
                    res.status(StatusCodes.OK).json(
                        await this.publicProfileService.getAvailableUsers(
                            req.body.session.user.userId,
                        ),
                    );
                } catch (error) {
                    next(error);
                }
            },
        );

        router.get(
            '/matches',
            auth,
            validateUser,
            async (req: UserRequest, res: Response, next) => {
                try {
                    res.status(StatusCodes.OK).json(
                        await this.publicProfileService.getMatches(
                            req.body.session.user.userId,
                        ),
                    );
                } catch (error) {
                    next(error);
                }
            },
        );

        router.get(
            '/find/:id',
            auth,
            validateUser,
            async (req: UserRequest<{ id: string }>, res: Response, next) => {
                try {
                    res.status(StatusCodes.OK).json(
                        await this.publicProfileService.findUser(
                            Number(req.params.id),
                            req.body.session.user.userId,
                        ),
                    );
                } catch (error) {
                    next(error);
                }
            },
        );
    }
}
