/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { PublicProfileService } from './public-profile-service';
import { TestingModule } from '../../tests/testing-modules';
import { PEOPLE } from '../../constants/test-users';
import { UserService } from '../user-service/user-service';
import { UserValidationService } from '../user-validation-service/user-validation-service';
import { MatchingService } from '../matching-service/matching-service';
import { ModerationService } from '../moderation-service/moderation-service';
import { AdminUserService } from '../admin-user-service/admin-user-service';
import { DatabaseService } from '../database-service/database-service';

const USER_EMAIL = 'Raphael';
const OTHER_USER = 'Roxane';

describe('PublicProfileService', () => {
    let testingModule: TestingModule;
    let service: PublicProfileService;
    let userService: UserService;
    let userValidationService: UserValidationService;
    let matchingService: MatchingService;
    let moderationService: ModerationService;
    let adminUserService: AdminUserService;
    let databaseService: DatabaseService;

    beforeEach(async () => {
        testingModule = await TestingModule.create();
    });

    beforeEach(async () => {
        service = testingModule.resolve(PublicProfileService);
        userService = testingModule.resolve(UserService);
        userValidationService = testingModule.resolve(UserValidationService);
        matchingService = testingModule.resolve(MatchingService);
        moderationService = testingModule.resolve(ModerationService);
        adminUserService = testingModule.resolve(AdminUserService);
        databaseService = testingModule.resolve(DatabaseService);
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

        it('should return empty list if active user profile is not ready', async () => {
            const user = await userService.getUserByEmail(USER_EMAIL);

            await userValidationService.setUserProfileReady(user.userId, false);

            expect(await service.getAvailableUsers(user.userId)).toHaveLength(
                0,
            );
        });

        it('should not return a user if their profile is not ready', async () => {
            const user = await userService.getUserByEmail(USER_EMAIL);
            const otherUser = await userService.getUserByEmail(OTHER_USER);

            await userValidationService.setUserProfileReady(
                otherUser.userId,
                false,
            );

            expect(
                (await service.getAvailableUsers(user.userId)).map(
                    (user) => user.userId,
                ),
            ).not.toContain(otherUser.userId);
        });

        it('should not return a user if active user already swiped them', async () => {
            const user = await userService.getUserByEmail(USER_EMAIL);
            const otherUser = await userService.getUserByEmail(OTHER_USER);

            await matchingService.swipeUser(
                user.userId,
                otherUser.userId,
                true,
            );

            expect(
                (await service.getAvailableUsers(user.userId)).map(
                    (user) => user.userId,
                ),
            ).not.toContain(otherUser.userId);
        });

        it('should not return a user if user is blocked by active user', async () => {
            const user = await userService.getUserByEmail(USER_EMAIL);
            const otherUser = await userService.getUserByEmail(OTHER_USER);

            await moderationService.blockUser({
                blockingUserId: user.userId,
                blockedUserId: otherUser.userId,
            });

            expect(
                (await service.getAvailableUsers(user.userId)).map(
                    (user) => user.userId,
                ),
            ).not.toContain(otherUser.userId);
        });

        it('should not return a user if user if banned', async () => {
            const user = await userService.getUserByEmail(USER_EMAIL);
            const otherUser = await userService.getUserByEmail(OTHER_USER);

            await adminUserService.banUser(otherUser.userId, '');

            expect(
                (await service.getAvailableUsers(user.userId)).map(
                    (user) => user.userId,
                ),
            ).not.toContain(otherUser.userId);
        });

        it('should not return a user if user is suspended', async () => {
            const user = await userService.getUserByEmail(USER_EMAIL);
            const otherUser = await userService.getUserByEmail(OTHER_USER);

            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);

            await adminUserService.suspendUser(otherUser.userId, date, '');

            expect(
                (await service.getAvailableUsers(user.userId)).map(
                    (user) => user.userId,
                ),
            ).not.toContain(otherUser.userId);
        });

        it('should return a user if user suspension is over', async () => {
            const user = await userService.getUserByEmail(USER_EMAIL);
            const otherUser = await userService.getUserByEmail(OTHER_USER);

            await adminUserService.suspendUser(
                otherUser.userId,
                new Date(2000, 1, 1),
                '',
            );

            expect(
                (await service.getAvailableUsers(user.userId)).map(
                    (user) => user.userId,
                ),
            ).toContain(otherUser.userId);
        });

        it('should not return a user if user is not visible', async () => {
            const user = await userService.getUserByEmail(USER_EMAIL);
            const otherUser = await userService.getUserByEmail(OTHER_USER);

            await databaseService.database('userVisibility').insert({
                userId: otherUser.userId,
                visible: false,
            });

            expect(
                (await service.getAvailableUsers(user.userId)).map(
                    (user) => user.userId,
                ),
            ).not.toContain(otherUser.userId);
        });

        it('should always return the users in the same order', async () => {
            const user = await userService.getUserByEmail(USER_EMAIL);

            const result = await service.getAvailableUsers(user.userId);

            for (let i = 0; i < 5; i++) {
                const newResult = await service.getAvailableUsers(user.userId);
                expect(newResult.map((user) => user.userId)).toEqual(
                    result.map((user) => user.userId),
                );
            }
        });
    });
});
