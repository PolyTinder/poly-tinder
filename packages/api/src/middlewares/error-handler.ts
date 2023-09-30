import express from 'express';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { HttpException } from '../models/http-exception';
import { env } from '../utils/environment';
import { logger } from '../utils/logger';

interface ErrorResponse {
    message: string;
    error: string;
    stack?: string[];
}

export function errorHandler(
    error: Error,
    req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction,
) {
    const status =
        error instanceof HttpException
            ? error.status
            : StatusCodes.INTERNAL_SERVER_ERROR;

    const response: ErrorResponse = {
        message: error.message,
        error: getReasonPhrase(status),
    };

    res.locals.message = error.message;
    res.locals.error = env.isDev ? error : {};

    if (env.isDev) {
        response.stack = error.stack?.split('\n');
    }

    logger.error(
        `${req.method} ${req.path} ${status}: ${error.name} - ${error.message}\n${error.stack}`,
    );

    res.status(status).json(response);
}
