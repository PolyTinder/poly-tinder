import { NextFunction, Response } from 'express';
import { container } from 'tsyringe';
import { AuthenticationService } from '../services/authentication-service/authentication-service';
import { UserRequest } from '../types/requests';
import { HttpException } from '../models/http-exception';
import { StatusCodes } from 'http-status-codes';

export const auth = async (
    req: UserRequest,
    res: Response,
    next: NextFunction,
) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token || token === 'null') {
        return next(
            new HttpException('Unauthorized', StatusCodes.UNAUTHORIZED),
        );
    }

    try {
        req.body = {
            ...req.body,
            session: await container
                .resolve(AuthenticationService)
                .loadSession(token, Boolean(req.query.admin)),
        };
    } catch (e) {
        return next(e);
    }

    next();
};
