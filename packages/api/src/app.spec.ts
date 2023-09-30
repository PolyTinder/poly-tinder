import { container } from 'tsyringe';
import { Application } from './app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

describe('Application', () => {
    let app: Application;

    beforeEach(() => {
        app = container.resolve(Application);
    });

    describe('Error 404', () => {
        it('should return error', () => {
            return request(app['app'])
                .get('/404')
                .expect(StatusCodes.NOT_FOUND);
        });
    });
});
