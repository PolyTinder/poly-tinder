// 810 x 1440
import { PEOPLE } from '../src/constants/test-users';

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
    await knex('verificationTokens').del();
    await knex('admin').del();
    await knex('userVisibility').del();
    await knex('banned').del();
    await knex('suspend').del();
    await knex('reports').del();
    await knex('blocks').del();
    await knex('messages').del();
    await knex('userAliases').del();
    await knex('userValidations').del();
    await knex('userProfiles').del();
    await knex('swipes').del();
    await knex('matches').del();
    await knex('sessions').del();
    await knex('users').del();

    for (const person of PEOPLE) {
        const [userId] = await knex('users').insert({
            email: person.email,
            hash: '',
            salt: '',
        });

        await knex('userProfiles').insert({
            userId,
            name: person.name,
            age: person.age,
            bio: "Hi, I'm " + person.name + '!',
            picture1: person.picture,
            genderCategory: person.gender,
            genderPreference: person.genderPreference,
        });

        await knex('userValidations').insert({
            userId,
            emailValidated: true,
            userProfileReady: true,
        });
    }

    // await knex('table_name').insert([
    //     { id: 1, colName: 'rowValue1' },
    //     { id: 2, colName: 'rowValue2' },
    //     { id: 3, colName: 'rowValue3' },
    // ]);
};
