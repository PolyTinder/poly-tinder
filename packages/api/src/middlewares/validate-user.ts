import { NextFunction, Response } from 'express';
import { UserRequest } from '../types/requests';
import { container } from 'tsyringe';
import { HttpException } from '../models/http-exception';
import { StatusCodes } from 'http-status-codes';
import { UserValidationService } from '../services/user-validation-service/user-validation-service';

export const validateUser = async (
    req: UserRequest,
    res: Response,
    next: NextFunction,
) => {
    if (
        !(await container
            .resolve(UserValidationService)
            .isUserValid(req.body.session.user.userId))
    ) {
        return next(
            new HttpException('User not valid', StatusCodes.UNAUTHORIZED),
        );
    }

    next();
};
