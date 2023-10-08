import './configs/registry';
import { injectAll, singleton } from 'tsyringe';
import express from 'express';
import { AbstractController } from './controllers';
import { SYMBOLS } from './constants/symbols';
import { errorHandler } from './middlewares/error-handler';
import { HttpException } from './models/http-exception';
import { StatusCodes } from 'http-status-codes';
import morgan from 'morgan';
import cors from 'cors';
import hpp from 'hpp';
import http from 'http';
import { env } from './utils/environment';
import { resolve } from 'path';
import { logger } from './utils/logger';
import helmet from 'helmet';
import { DatabaseService } from './services/database-service/database-service';
import { WsService } from './services/ws-service/ws-service';
import { auth } from './middlewares/auth';
import { adminOnly } from './middlewares/admin-only';

@singleton()
export class ApplicationAdmin {
    private app: express.Application;
    private server: http.Server;

    constructor(
        @injectAll(SYMBOLS.controller)
        private readonly controllers: AbstractController[],
        @injectAll(SYMBOLS.adminController)
        private readonly adminControllers: AbstractController[],
        private readonly databaseService: DatabaseService,
        private readonly wsService: WsService,
    ) {
        this.app = express();
        this.server = http.createServer(this.app);

        this.configureMiddlewares();
        this.configureRoutes();
    }

    start(port: number | string) {
        this.server.listen(port, () => {
            logger.info(`🏔️ Enviroment : ${env.NODE_ENV}`);
            logger.info(
                `🚀 Server up on port ${port} (http://localhost:${port})`,
            );
        });
        this.wsService.instantiate(this.server);
    }

    async init() {
        await this.databaseService.instantiate(false);
    }

    private configureMiddlewares() {
        this.app.use(
            morgan('dev', {
                skip: function (req, res) {
                    return env.isDev ? false : res.statusCode < 400;
                },
            }),
        );
        this.app.use(express.static(resolve(__dirname, '../public')));
        this.app.use(cors({ origin: env.CORS }));
        this.app.use(hpp());
        this.app.use(helmet());
        this.app.use(express.json());
    }

    private configureRoutes() {
        for (const controller of this.controllers) {
            controller.use(this.app);
        }

        this.app.use(auth);
        this.app.use(adminOnly);

        for (const controller of this.adminControllers) {
            controller.use(this.app);
        }

        this.app.use('**', (req, res, next) =>
            next(
                new HttpException(
                    `Cannot ${req.method} for ${req.path}`,
                    StatusCodes.NOT_FOUND,
                ),
            ),
        );

        this.app.use(errorHandler);
    }
}
