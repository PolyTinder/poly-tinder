import { Router } from 'express';
import { AbstractController } from '../abstract-controller';
import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import { PublicProfileService } from '../../services/public-profile-service/public-profile-service';

@singleton()
export class DefaultController extends AbstractController {
    constructor(private readonly publicProfileService: PublicProfileService) {
        super('/');
    }

    protected configureRouter(router: Router): void {
        router.get('/', async (req, res) => {
            res.status(StatusCodes.OK).json({ hello: 'world!' });
        });
    }
}
