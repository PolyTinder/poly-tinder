import { Router } from 'express';
import { AbstractController } from '../abstract-controller';
import { StatusCodes } from 'http-status-codes';
import { singleton } from 'tsyringe';
import { AdminUserService } from '../../services/admin-user-service/admin-user-service';

@singleton()
export class AdminUserController extends AbstractController {
    constructor(private readonly adminUserService: AdminUserService) {
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
    }
}
