import { NextFunction, Response } from 'express';
import { UserRequest } from '../types/requests';
import { container } from 'tsyringe';
import { UserService } from '../services/user-service/user-service';
import { HttpException } from '../models/http-exception';
import { StatusCodes } from 'http-status-codes';

export const validateUser = async (
    req: UserRequest,
    res: Response,
    next: NextFunction,
) => {
    if (
        !(await container
            .resolve(UserService)
            .isUserValid(req.body.session.user.userId))
    ) {
        return next(
            new HttpException('User not valid', StatusCodes.UNAUTHORIZED),
        );
    }

    next();
};
