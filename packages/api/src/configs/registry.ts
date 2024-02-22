import { registry } from 'tsyringe';
import { SYMBOLS } from '../constants/symbols';
import { DefaultController } from '../controllers';
import { AuthenticationController } from '../controllers/authentication-controller/authentication-controller';
import { UserProfileController } from '../controllers/user-profile-controller/user-profile-controller';
import { PublicProfileController } from '../controllers/public-profile-controller/public-profile-controller';
import { MatchingController } from '../controllers/matching-controller/matching-controller';
import { MessagesController } from '../controllers/messages-controller/messages-controller';
import { ModerationController } from '../controllers/moderation-controller/moderation-controller';
import { UserValidationController } from '../controllers/user-validation-controller/user-validation-controller';
import { UserController } from '../controllers/user-controller/user-controller';
import { AdminUserController } from '../controllers/admin-user-controller/admin-user-controller';
import { AdminModerationController } from '../controllers/admin-moderation-controller/admin-moderation-controller';
import { NotificationController } from '../controllers/notification-controller/notification-controller';

@registry([
    { token: SYMBOLS.controller, useClass: DefaultController },
    { token: SYMBOLS.controller, useClass: AuthenticationController },
    { token: SYMBOLS.controller, useClass: UserProfileController },
    { token: SYMBOLS.controller, useClass: PublicProfileController },
    { token: SYMBOLS.controller, useClass: MatchingController },
    { token: SYMBOLS.controller, useClass: MessagesController },
    { token: SYMBOLS.controller, useClass: ModerationController },
    { token: SYMBOLS.controller, useClass: UserValidationController },
    { token: SYMBOLS.controller, useClass: UserController },
    { token: SYMBOLS.controller, useClass: NotificationController },
    { token: SYMBOLS.adminController, useClass: AdminUserController },
    { token: SYMBOLS.adminController, useClass: AdminModerationController },
])
export class Registry {}
