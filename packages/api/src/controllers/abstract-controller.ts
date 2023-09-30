import express from 'express';

export abstract class AbstractController {
    private path: string;
    private router: express.Router;

    constructor(path = '/') {
        this.path = path;
        this.router = express.Router();

        this.configureRouter(this.router);
    }

    use(app: express.Application): void {
        app.use(this.path, this.router);
    }

    protected abstract configureRouter(router: express.Router): void;
}
