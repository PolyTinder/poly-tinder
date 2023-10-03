import { Response, Router } from 'express';
import { AbstractController } from '../abstract-controller';
import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import { UserValidationService } from '../../services/user-validation-service/user-validation-service';
import { auth } from '../../middlewares/auth';
import { UserRequest } from '../../types/requests';
import { UserValidationResponse } from 'common/models/user';

@singleton()
export class UserValidationController extends AbstractController {
    constructor(private readonly userValidationService: UserValidationService) {
        super('/user-validation');
    }

    protected configureRouter(router: Router): void {
        router.get('/', auth, async (req: UserRequest, res: Response, next) => {
            try {
                const response: UserValidationResponse = {
                    userProfileReady:
                        await this.userValidationService.isUserValid(
                            req.body.session.user.userId,
                        ),
                };

                return res.status(StatusCodes.OK).send(response);
            } catch (e) {
                next(e);
            }
        });
    }
}
