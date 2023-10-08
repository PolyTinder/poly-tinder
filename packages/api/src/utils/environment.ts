import { cleanEnv, email, num, str } from 'envalid';

const env = cleanEnv(process.env, {
    NODE_ENV: str({
        choices: ['development', 'test', 'production', 'staging'],
    }),
    PORT: num({ default: 3000 }),

    CORS: str({ default: '*' }),
    LOG_DIR: str({ default: './logs' }),

    DB_HOST: str({ default: undefined }),
    DB_SOCKET_PATH: str({ default: undefined }),
    DB_PORT: num(),
    DB_USER: str(),
    DB_PASSWORD: str(),
    DB_DATABASE: str(),

    EMAIL: email(),
    MJ_APIKEY_PUBLIC: str(),
    MJ_APIKEY_PRIVATE: str(),

    JWT_SECRET: str({ default: '123' }),
});

export { env };
