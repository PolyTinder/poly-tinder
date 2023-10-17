/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PublicProfileService } from './public-profile-service';
import { TestingModule } from '../../tests/testing-modules';
import { PEOPLE } from '../../constants/test-users';
import { UserService } from '../user-service/user-service';

const USER_EMAIL = 'Raphael';

describe('PublicProfileService', () => {
    let testingModule: TestingModule;
    let service: PublicProfileService;
    let userService: UserService;

    beforeEach(async () => {
        testingModule = await TestingModule.create();
        await testingModule.seed();
    });

    beforeEach(async () => {
        service = testingModule.resolve(PublicProfileService);
        userService = testingModule.resolve(UserService);
    });

    afterEach(async () => {
        await testingModule.restore();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findUser', () => {
        it('should return the user', async () => {
            const user = await userService.getUserByEmail(USER_EMAIL);

            const foundUser = await service.findUser(user.userId, user.userId);

            expect(foundUser).toBeDefined();
            expect(foundUser.userId).toEqual(user.userId);
        });

        it('should throw if the user is not found', async () => {
            const user = await userService.getUserByEmail(USER_EMAIL);

            await expect(service.findUser(user.userId, -1)).rejects.toThrow();
        });
    });

    describe('getAvailableUsers', () => {
        it('should return everyone if is other and looking for all', async () => {
            const EMAIL = 'Alex';

            const user = await userService.getUserByEmail(EMAIL);

            const expected = PEOPLE.filter((person) => person.email !== EMAIL);
            const expectedUsers = await Promise.all(
                expected.map((person) =>
                    userService.getUserByEmail(person.email),
                ),
            );
            const result = await service.getAvailableUsers(user.userId);

            expect(result.map((user) => user.userId).sort()).toEqual(
                expectedUsers.map((user) => user.userId).sort(),
            );
        });

        it('should return all women and other looking for men or all', async () => {
            const EMAIL = 'Remy';

            const user = await userService.getUserByEmail(EMAIL);

            const expected = PEOPLE.filter(
                (person) =>
                    person.email !== EMAIL &&
                    (person.gender === 'woman' || person.gender === 'other') &&
                    (person.genderPreference === 'man' ||
                        person.genderPreference === 'all'),
            );
            const expectedUsers = await Promise.all(
                expected.map((person) =>
                    userService.getUserByEmail(person.email),
                ),
            );
            const result = await service.getAvailableUsers(user.userId);

            expect(result.map((user) => user.userId).sort()).toEqual(
                expectedUsers.map((user) => user.userId).sort(),
            );
        });

        it('should return all men and other looking for women or all', async () => {
            const EMAIL = 'Roxane';

            const user = await userService.getUserByEmail(EMAIL);

            const expected = PEOPLE.filter(
                (person) =>
                    person.email !== EMAIL &&
                    (person.gender === 'man' || person.gender === 'other') &&
                    (person.genderPreference === 'woman' ||
                        person.genderPreference === 'all'),
            );
            const expectedUsers = await Promise.all(
                expected.map((person) =>
                    userService.getUserByEmail(person.email),
                ),
            );
            const result = await service.getAvailableUsers(user.userId);

            expect(result.map((user) => user.userId).sort()).toEqual(
                expectedUsers.map((user) => user.userId).sort(),
            );
        });

        it('should return everyone looking for women or all', async () => {
            const EMAIL = 'Auguste';

            const user = await userService.getUserByEmail(EMAIL);

            const expected = PEOPLE.filter(
                (person) =>
                    person.email !== EMAIL &&
                    (person.genderPreference === 'woman' ||
                        person.genderPreference === 'all'),
            );
            const expectedUsers = await Promise.all(
                expected.map((person) =>
                    userService.getUserByEmail(person.email),
                ),
            );
            const result = await service.getAvailableUsers(user.userId);

            expect(result.map((user) => user.userId).sort()).toEqual(
                expectedUsers.map((user) => user.userId).sort(),
            );
        });

        it('should return all women and other looking for anyone', async () => {
            const EMAIL = 'Raphael';

            const user = await userService.getUserByEmail(EMAIL);

            const expected = PEOPLE.filter(
                (person) =>
                    person.email !== EMAIL &&
                    (person.gender === 'woman' || person.gender === 'other'),
            );
            const expectedUsers = await Promise.all(
                expected.map((person) =>
                    userService.getUserByEmail(person.email),
                ),
            );
            const result = await service.getAvailableUsers(user.userId);

            expect(result.map((user) => user.userId).sort()).toEqual(
                expectedUsers.map((user) => user.userId).sort(),
            );
        });
    });
});
