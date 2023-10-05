import 'reflect-metadata';
import 'dotenv/config';
import './utils/logger';
import { container } from 'tsyringe';
import { env } from './utils/environment';
import { ApplicationAdmin } from './app-admin';

(async () => {
    const application = container.resolve(ApplicationAdmin);

    await application.init();

    application.start(env.PORT);
})();
