import { NextFunction, Response } from 'express';
import { UserRequest } from '../types/requests';
import { container } from 'tsyringe';
import { AdminService } from '../services/admin-service/admin-service';
import { HttpException } from '../models/http-exception';
import { StatusCodes } from 'http-status-codes';

export const adminOnly = async (
    req: UserRequest,
    res: Response,
    next: NextFunction,
) => {
    const adminService = container.resolve(AdminService);

    if (!(await adminService.isAdmin(req.body.session.user.userId))) {
        return next(
            new HttpException('Unauthorized', StatusCodes.UNAUTHORIZED),
        );
    }

    next();
};
