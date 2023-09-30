import { Response, Router } from 'express';
import { AbstractController } from '../abstract-controller';
import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import { UserProfileService } from '../../services/user-profile-service/user-profile-service';
import { auth } from '../../middlewares/auth';
import { UserRequest } from '../../types/requests';
import { UserProfile } from 'common/models/user';

@singleton()
export class UserProfileController extends AbstractController {
    constructor(private readonly userProfileService: UserProfileService) {
        super('/user/profile');
    }

    protected configureRouter(router: Router): void {
        router.get('/', auth, async (req: UserRequest, res: Response, next) => {
            try {
                const profile = await this.userProfileService.getUserProfile(
                    req.body.session.user.userId,
                );
                res.status(StatusCodes.OK).json(profile);
            } catch (e) {
                next(e);
            }
        });

        router.patch(
            '/',
            auth,
            async (
                req: UserRequest<object, { userProfile: UserProfile }>,
                res: Response,
                next,
            ) => {
                try {
                    await this.userProfileService.setUserProfile(
                        req.body.session.user.userId,
                        req.body.userProfile ?? {},
                    );
                    res.status(StatusCodes.OK).json();
                } catch (e) {
                    next(e);
                }
            },
        );
    }
}
