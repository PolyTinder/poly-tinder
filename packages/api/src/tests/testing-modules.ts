import { SinonSandbox, SinonStub, createSandbox } from 'sinon';
import { DependencyContainer, InjectionToken, container } from 'tsyringe';
import { DatabaseService } from '../services/database-service/database-service';
import { constructor } from 'tsyringe/dist/typings/types';

type StubbedMember<T> = T extends (...args: infer TArgs) => infer TReturnValue
    ? SinonStub<TArgs, TReturnValue>
    : T;

type ClassOverride<TType> = {
    [K in keyof TType]?:
        | StubbedMember<TType[K]>
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        | (TType[K] extends (...args: any[]) => infer R ? R : TType[K]);
};

export class TestingModule {
    private sandbox: SinonSandbox;
    private container: DependencyContainer;
    private databaseService: DatabaseService;

    constructor() {
        this.sandbox = createSandbox();
        this.container = container.createChildContainer();
        this.databaseService = this.container.resolve(DatabaseService);
    }

    static async create() {
        const module = new TestingModule();
        await module.instantiate();

        return module;
    }

    async instantiate() {
        await this.databaseService.instantiate();
    }

    async seed() {
        await this.databaseService.database.seed.run();
    }

    resolve<T>(token: InjectionToken<T>): T {
        return this.container.resolve(token);
    }

    stub<T>(constructor: constructor<T>, overrides?: ClassOverride<T>) {
        const instance = this.sandbox.createStubInstance(
            constructor,
            overrides,
        );
        this.container.register(constructor, instance as constructor<T>);

        return instance;
    }

    async restore() {
        await this.databaseService.disconnect();
        this.sandbox.restore();
        this.container.reset();
    }
}
