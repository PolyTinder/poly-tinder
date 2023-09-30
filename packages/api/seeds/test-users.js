const PEOPLE = [
    {
        name: 'Mariane',
        email: 'Mariane',
        password: 'Mariane',
        gender: 'woman',
        genderPreference: 'man',
        age: 24,
        picture: 'https://ucarecdn.com/b044bda8-852d-4027-a50a-b56cd6d8c78a/',
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
            'https://ucarecdn.com/65c98a8b-bd6d-4d97-bc90-a439612fa73c/',
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
            'https://ucarecdn.com/65c98a8b-bd6d-4d97-bc90-a439612fa73c/',
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
            'https://ucarecdn.com/e2909305-3223-4dd3-a6d5-2ed2d8981b3e/',
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
            'https://ucarecdn.com/fc0e99cf-0211-42ad-ada7-f3d9dd2ea03a/',
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
            'https://ucarecdn.com/616ad4de-ebe5-4bb4-b6cc-fc06247584dd/',
    },
    {
        name: 'Remy',
        email: 'Remy',
        password: 'Remy',
        gender: 'man',
        genderPreference: 'woman',
        age: 20,
        picture:
            'https://ucarecdn.com/8ca38392-427c-46b6-8251-3eed3ec37fd7/',
    },
    {
        name: 'Florent',
        email: 'Florent',
        password: 'Florent',
        gender: 'man',
        genderPreference: 'man',
        age: 20,
        picture:
            'https://ucarecdn.com/08b26d52-0a7d-411a-b2ab-557b0ced95c8/',
    },
    {
        name: 'Raphael',
        email: 'Raphael',
        password: 'Raphael',
        gender: 'other',
        genderPreference: 'woman',
        age: 20,
        picture:
            'https://ucarecdn.com/9f74253b-e515-4c30-8e98-f1f503171c7e/',
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
