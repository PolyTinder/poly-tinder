import { container } from 'tsyringe';
import { Application } from '../../app';
import request from 'supertest';
import express from 'express';
import { StatusCodes } from 'http-status-codes';

describe('DefaultController', () => {
    let app: express.Application;

    beforeEach(() => {
        app = container.resolve(Application)['app'];
    });

    describe('GET /', () => {
        it('should return hello world!', async () => {
            return request(app)
                .get('/')
                .expect(StatusCodes.OK)
                .then((res) => expect(res.body.hello).toEqual('world!'));
        });
    });
});
