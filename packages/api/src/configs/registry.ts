import { registry } from 'tsyringe';
import { SYMBOLS } from '../constants/symbols';
import { DefaultController } from '../controllers';
import { AuthenticationController } from '../controllers/authentication-controller/authentication-controller';
import { UserProfileController } from '../controllers/user-profile-controller/user-profile-controller';

@registry([
    { token: SYMBOLS.controller, useClass: DefaultController },
    { token: SYMBOLS.controller, useClass: AuthenticationController },
    { token: SYMBOLS.controller, useClass: UserProfileController },
])
export class Registry {}
