import { Request, Response, Router } from 'express';
import { AbstractController } from '../abstract-controller';
import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import {
    AuthenticationUser,
    Token,
    UserSavedSession,
} from 'common/models/authentication';
import { AuthenticationService } from '../../services/authentication-service/authentication-service';
import { auth } from '../../middlewares/auth';
import { UserRequest } from '../../types/requests';

@singleton()
export class AuthenticationController extends AbstractController {
    constructor(private readonly authenticationService: AuthenticationService) {
        super('/auth');
    }

    protected configureRouter(router: Router): void {
        router.post(
            '/signup',
            async (
                req: Request<object, object, AuthenticationUser>,
                res,
                next,
            ) => {
                try {
                    res.status(StatusCodes.OK).json(
                        await this.authenticationService.signup(req.body),
                    );
                } catch (error) {
                    next(error);
                }
            },
        );

        router.post(
            '/login',
            async (
                req: Request<object, object, AuthenticationUser>,
                res,
                next,
            ) => {
                try {
                    res.status(StatusCodes.OK).json(
                        await this.authenticationService.login(req.body),
                    );
                } catch (error) {
                    next(error);
                }
            },
        );

        router.post('/load', auth, async (req: UserRequest, res: Response) => {
            res.status(StatusCodes.NO_CONTENT).send();
        });

        router.post(
            '/logout',
            auth,
            async (req: UserRequest, res: Response) => {
                await this.authenticationService.logout(req.body.session.token);
                res.status(StatusCodes.NO_CONTENT).send();
            },
        );

        router.post(
            '/logout-all',
            auth,
            async (req: UserRequest, res: Response) => {
                await this.authenticationService.logoutAll(
                    req.body.session.token,
                );
                res.status(StatusCodes.OK).end();
            },
        );
    }
}
