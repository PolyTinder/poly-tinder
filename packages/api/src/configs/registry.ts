import { registry } from 'tsyringe';
import { SYMBOLS } from '../constants/symbols';
import { DefaultController } from '../controllers';
import { AuthenticationController } from '../controllers/authentication-controller/authentication-controller';
import { UserProfileController } from '../controllers/user-profile-controller/user-profile-controller';
import { PublicProfileController } from '../controllers/public-profile-controller/public-profile-controller';
import { MatchingController } from '../controllers/matching-controller/matching-controller';
import { MessagesController } from '../controllers/messages-controller/messages-controller';
import { ModerationController } from '../controllers/moderation-controller/moderation-controller';

@registry([
    { token: SYMBOLS.controller, useClass: DefaultController },
    { token: SYMBOLS.controller, useClass: AuthenticationController },
    { token: SYMBOLS.controller, useClass: UserProfileController },
    { token: SYMBOLS.controller, useClass: PublicProfileController },
    { token: SYMBOLS.controller, useClass: MatchingController },
    { token: SYMBOLS.controller, useClass: MessagesController },
    { token: SYMBOLS.controller, useClass: ModerationController },
])
export class Registry {}
