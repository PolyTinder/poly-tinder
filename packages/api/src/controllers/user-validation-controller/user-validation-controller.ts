import { Response, Router } from 'express';
import { AbstractController } from '../abstract-controller';
import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import { UserValidationService } from '../../services/user-validation-service/user-validation-service';
import { auth } from '../../middlewares/auth';
import { UserRequest } from '../../types/requests';

@singleton()
export class UserValidationController extends AbstractController {
    constructor(private readonly userValidationService: UserValidationService) {
        super('/user-validation');
    }

    protected configureRouter(router: Router): void {
        router.get('/', auth, async (req: UserRequest, res: Response, next) => {
            try {
                return res
                    .status(StatusCodes.OK)
                    .send(
                        await this.userValidationService.fetchValidation(
                            req.body.session.user.userId,
                        ),
                    );
            } catch (e) {
                next(e);
            }
        });

        router.post(
            '/email',
            auth,
            async (
                req: UserRequest<object, { token: string }>,
                res: Response,
                next,
            ) => {
                try {
                    await this.userValidationService.validateEmail(
                        req.body.session.user.userId,
                        req.body.token,
                    );

                    return res.status(StatusCodes.OK).send();
                } catch (e) {
                    next(e);
                }
            },
        );

        router.post(
            '/email/request',
            auth,
            async (req: UserRequest, res: Response, next) => {
                try {
                    await this.userValidationService.requestEmailValidation(
                        req.body.session.user.userId,
                    );

                    return res.status(StatusCodes.OK).send();
                } catch (e) {
                    next(e);
                }
            },
        );
    }
}
