import { StatusCodes } from 'http-status-codes';

export class HttpException extends Error {
    status: number;

    constructor(
        message?: string,
        status: number = StatusCodes.INTERNAL_SERVER_ERROR,
    ) {
        super(message);
        this.status = status;
    }
}
