// 810 x 1440
const PEOPLE = [
    {
        name: 'Mariane',
        email: 'Mariane',
        password: 'Mariane',
        gender: 'woman',
        genderPreference: 'man',
        age: 24,
        picture: 'samples/upscale-face-1',
    },
    {
        // Roxane
        name: 'Roxane',
        email: 'Roxane',
        password: 'Roxane',
        gender: 'woman',
        genderPreference: 'man',
        age: 22,
        picture: 'samples/woman-on-a-football-field',
    },
    {
        // Colette
        name: 'Colette',
        email: 'Colette',
        password: 'Colette',
        gender: 'woman',
        genderPreference: 'woman',
        age: 22,
        picture: 'samples/dessert-on-a-plate',
    },
    {
        // Auguste
        name: 'Auguste',
        email: 'Auguste',
        password: 'Auguste',
        gender: 'woman',
        genderPreference: 'all',
        age: 34,
        picture: 'samples/cup-on-a-table',
    },
    {
        // Marine
        name: 'Marine',
        email: 'Marine',
        password: 'Marine',
        gender: 'other',
        genderPreference: 'man',
        age: 20,
        picture: 'samples/chair',
    },
    {
        // Matisse
        name: 'Matisse',
        email: 'Matisse',
        password: 'Matisse',
        gender: 'man',
        genderPreference: 'woman',
        age: 20,
        picture: 'samples/chair-and-coffee-table',
    },
    {
        name: 'Remy',
        email: 'Remy',
        password: 'Remy',
        gender: 'man',
        genderPreference: 'woman',
        age: 20,
        picture: 'samples/man-portrait',
    },
    {
        name: 'Florent',
        email: 'Florent',
        password: 'Florent',
        gender: 'man',
        genderPreference: 'man',
        age: 20,
        picture: 'samples/man-on-a-street',
    },
    {
        name: 'Raphael',
        email: 'Raphael',
        password: 'Raphael',
        gender: 'other',
        genderPreference: 'woman',
        age: 20,
        picture: 'samples/man-on-a-escalator',
    },
    {
        name: 'Alex',
        email: 'Alex',
        password: 'Alex',
        gender: 'other',
        genderPreference: 'all',
        age: 20,
        picture: 'samples/outdoor-woman',
    },
];

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
