import { Router } from 'express';
import { AbstractController } from '../abstract-controller';
import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import { DatabaseService } from '../../services/database-service/database-service';
import { AuthenticationService } from '../../services/authentication-service/authentication-service';

@singleton()
export class DefaultController extends AbstractController {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly authenticationService: AuthenticationService,
    ) {
        super('/');
    }

    protected configureRouter(router: Router): void {
        router.get('/', async (req, res) => {
            res.status(StatusCodes.OK).json({ hello: 'world!' });
        });
    }
}
