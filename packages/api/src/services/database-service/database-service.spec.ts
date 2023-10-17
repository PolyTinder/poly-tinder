import { DatabaseService } from './database-service';
import { TestingModule } from '../../tests/testing-modules';

describe('DatabaseService', () => {
    let testingModule: TestingModule;
    let service: DatabaseService;

    beforeEach(async () => {
        testingModule = await TestingModule.create();
    });

    beforeEach(async () => {
        service = testingModule.resolve(DatabaseService);
    });

    afterEach(async () => {
        await testingModule.restore();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should be connected', () => {
        expect(service.isConnected()).toBe(true);
    });

    it('should query', async () => {
        await expect(service.database.raw('SELECT 1')).resolves.not.toThrow();
    });
});
