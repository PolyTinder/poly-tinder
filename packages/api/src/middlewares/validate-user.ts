import { NextFunction, Response } from 'express';
import { UserRequest } from '../types/requests';
import { container } from 'tsyringe';
import { HttpException } from '../models/http-exception';
import { StatusCodes } from 'http-status-codes';
import { UserValidationService } from '../services/user-validation-service/user-validation-service';
import { ModerationService } from '../services/moderation-service/moderation-service';

export const validateUser = async (
    req: UserRequest,
    res: Response,
    next: NextFunction,
) => {
    try {
        const [userValid, userBannedOrSuspended] = await Promise.all([
            container
                .resolve(UserValidationService)
                .isUserValid(req.body.session.user.userId),
            container
                .resolve(ModerationService)
                .isBannedOrSuspended(req.body.session.user.userId),
        ]);

        if (userBannedOrSuspended) {
            return new HttpException(
                'Cannot access account',
                StatusCodes.BAD_REQUEST,
            );
        }

        if (!userValid) {
            return next(
                new HttpException('User not valid', StatusCodes.UNAUTHORIZED),
            );
        }

        next();
    } catch (e) {
        next(e);
    }
};
