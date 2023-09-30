// 810 x 1440

const PEOPLE = [
    {
        name: 'Mariane',
        email: 'Mariane',
        password: 'Mariane',
        gender: 'woman',
        genderPreference: 'man',
        age: 24,
        picture: 'https://ucarecdn.com/7adc2c13-2f08-4e87-9c37-7a4248aac3b0/',
    },
    {
        // Roxane
        name: 'Roxane',
        email: 'Roxane',
        password: 'Roxane',
        gender: 'woman',
        genderPreference: 'man',
        age: 22,
        picture:
            'https://ucarecdn.com/47833623-5715-47b8-b3fe-6db020874501/',
    },
    {
        // Colette
        name: 'Colette',
        email: 'Colette',
        password: 'Colette',
        gender: 'woman',
        genderPreference: 'woman',
        age: 22,
        picture:
            'https://ucarecdn.com/1c7ff1ad-f274-4bf6-8241-21a7cf3125ce/',
    },
    {
        // Auguste
        name: 'Auguste',
        email: 'Auguste',
        password: 'Auguste',
        gender: 'woman',
        genderPreference: 'all',
        age: 34,
        picture:
            'https://ucarecdn.com/23c84f89-40f4-435e-91c4-b6576da43ecc/',
    },
    {
        // Marine
        name: 'Marine',
        email: 'Marine',
        password: 'Marine',
        gender: 'other',
        genderPreference: 'man',
        age: 20,
        picture:
            'https://ucarecdn.com/66d3771a-a452-47a7-b1d3-0da7bf279903/',
    },
    {
        // Matisse
        name: 'Matisse',
        email: 'Matisse',
        password: 'Matisse',
        gender: 'man',
        genderPreference: 'woman',
        age: 20,
        picture:
            'https://ucarecdn.com/7e330577-805d-4a2f-adc1-fe72d21fbdc4/',
    },
    {
        name: 'Remy',
        email: 'Remy',
        password: 'Remy',
        gender: 'man',
        genderPreference: 'woman',
        age: 20,
        picture:
            'https://ucarecdn.com/a7be89f3-ab33-49d4-b73f-6d75c7fad327/',
    },
    {
        name: 'Florent',
        email: 'Florent',
        password: 'Florent',
        gender: 'man',
        genderPreference: 'man',
        age: 20,
        picture:
            'https://ucarecdn.com/e1ae26cd-d83c-4a36-bf96-915ac8b53529/',
    },
    {
        name: 'Raphael',
        email: 'Raphael',
        password: 'Raphael',
        gender: 'other',
        genderPreference: 'woman',
        age: 20,
        picture:
            'https://ucarecdn.com/de155ea6-871f-4d87-a82e-e57c7f9e6ad3/',
    },
];

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    // Deletes ALL existing entries
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
