import { resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { env } from './environment';
import winston from 'winston';

const logDir = resolve(__dirname, '../../', env.LOG_DIR);

if (!existsSync(logDir)) {
    mkdirSync(logDir);
}

const logFormat = winston.format.printf(
    ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`,
);

const logger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat,
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.colorize(),
            ),
        }),
        new winston.transports.File({
            filename: 'combined.log',
            level: 'info',
            dirname: logDir,
            handleExceptions: true,
        }),
    ],
    exceptionHandlers: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.splat(),
                winston.format.colorize(),
            ),
        }),
        new winston.transports.File({
            filename: 'exceptions.log',
            dirname: logDir,
        }),
    ],
    level: env.isDev ? 'debug' : 'info',
});

export { logger };
