import { Request, Router } from 'express';
import { AbstractController } from '../abstract-controller';
import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import { AdminUserService } from '../../services/admin-user-service/admin-user-service';
import { UserService } from '../../services/user-service/user-service';
import { UserProfileService } from '../../services/user-profile-service/user-profile-service';

@singleton()
export class AdminUserController extends AbstractController {
    constructor(
        private readonly adminUserService: AdminUserService,
        private readonly userService: UserService,
        private readonly userProfileService: UserProfileService,
    ) {
        super('/admin/users');
    }

    protected configureRouter(router: Router): void {
        router.get('/', async (req, res, next) => {
            try {
                res.status(StatusCodes.OK).json(
                    await this.adminUserService.listUsers(),
                );
            } catch (e) {
                next(e);
            }
        });

        router.get('/profile/:userId', async (req, res, next) => {
            try {
                res.status(StatusCodes.OK).json(
                    await this.userProfileService.getUserProfile(
                        Number(req.params.userId),
                    ),
                );
            } catch (e) {
                next(e);
            }
        });

        router.get('/suspend/:userId', async (req, res, next) => {
            try {
                res.status(StatusCodes.OK).json(
                    await this.adminUserService.getSuspensionsForUser(
                        Number(req.params.userId),
                    ),
                );
            } catch (e) {
                next(e);
            }
        });

        router.post(
            '/suspend/:userId',
            async (
                req: Request<
                    { userId: string },
                    { until: string; reason?: string }
                >,
                res,
                next,
            ) => {
                try {
                    await this.adminUserService.suspendUser(
                        Number(req.params.userId),
                        new Date(req.body.until),
                        req.body.reason,
                    );
                    res.status(StatusCodes.OK).json();
                } catch (e) {
                    next(e);
                }
            },
        );

        router.delete('/suspend/:userId', async (req, res, next) => {
            try {
                await this.adminUserService.revokeSuspension(
                    Number(req.params.userId),
                );
                res.status(StatusCodes.OK).json();
            } catch (e) {
                next(e);
            }
        });

        router.get('/ban/:userId', async (req, res, next) => {
            try {
                res.status(StatusCodes.OK).json(
                    await this.adminUserService.getBanForUser(
                        Number(req.params.userId),
                    ),
                );
            } catch (e) {
                next(e);
            }
        });

        router.post('/ban/:userId', async (req, res, next) => {
            try {
                await this.adminUserService.banUser(
                    Number(req.params.userId),
                    req.body.reason,
                );
                res.status(StatusCodes.OK).json();
            } catch (e) {
                next(e);
            }
        });

        router.delete('/ban/:userId', async (req, res, next) => {
            try {
                await this.adminUserService.unbanUser(
                    Number(req.params.userId),
                );
                res.status(StatusCodes.OK).json();
            } catch (e) {
                next(e);
            }
        });

        router.get(
            '/:userId',
            async (req: Request<{ userId: string }>, res, next) => {
                try {
                    res.status(StatusCodes.OK).json(
                        await this.userService.getUser(
                            Number(req.params.userId),
                        ),
                    );
                } catch (e) {
                    next(e);
                }
            },
        );
    }
}
