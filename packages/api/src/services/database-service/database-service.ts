import { singleton } from 'tsyringe';
import knex, { Knex } from 'knex';
import { env } from '../../utils/environment';

@singleton()
export class DatabaseService {
    private db?: Knex;

    get database(): Knex {
        if (!this.db) {
            throw new Error('Database not instantiated');
        }

        return this.db;
    }

    async instantiate(migrate = true): Promise<void> {
        this.db = knex({
            client: 'mysql2',
            connection: this.getConnectionConfig(),
        });

        if (migrate) await this.db.migrate.latest();
    }

    isConnected(): boolean {
        return !!this.db;
    }

    private getConnectionConfig():
        | Knex.StaticConnectionConfig
        | Knex.ConnectionConfigProvider {
        if (env.DB_HOST) {
            return {
                host: env.DB_HOST,
                port: env.DB_PORT,
                user: env.DB_USER,
                password: env.DB_PASSWORD,
                database: env.DB_DATABASE,
            };
        }
        if (env.DB_SOCKET_PATH) {
            return {
                socketPath: env.DB_SOCKET_PATH,
                user: env.DB_USER,
                password: env.DB_PASSWORD,
                database: env.DB_DATABASE,
            };
        }

        throw new Error(
            'Invalid database configuration: Environment variables must contain either DB_HOST or DB_SOCKET_PATH',
        );
    }
}
