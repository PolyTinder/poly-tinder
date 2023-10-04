import { Response, Router } from 'express';
import { AbstractController } from '../abstract-controller';
import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import { UserDeletionService } from '../../services/user-deletion-service/user-deletion-service';
import { auth } from '../../middlewares/auth';
import { UserRequest } from '../../types/requests';

@singleton()
export class UserController extends AbstractController {
    constructor(private readonly userDeletionService: UserDeletionService) {
        super('/user');
    }

    protected configureRouter(router: Router): void {
        router.delete(
            '/',
            auth,
            async (
                req: UserRequest<object, { password: string }>,
                res: Response,
                next,
            ) => {
                try {
                    await this.userDeletionService.deleteUser(
                        req.body.session.user.userId,
                        req.body.password,
                    );
                    res.status(StatusCodes.NO_CONTENT).send();
                } catch (error) {
                    next(error);
                }
            },
        );
    }
}
