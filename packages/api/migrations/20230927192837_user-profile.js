/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('userProfiles', function (table) {
        table.integer('userId').unsigned().notNullable();
        table.string('name', 255);
        table.integer('age');
        table.string('bio', 255);
        table.string('picture1', 255);
        table.string('picture2', 255);
        table.string('picture3', 255);
        table.string('picture4', 255);
        table.string('picture5', 255);
        table.string('picture6', 255);
        table.string('interests', 255);
        table.string('associations', 255);
        table.string('program', 255);
        table.string('educationLevel', 255);
        table.integer('height');
        table.string('lookingFor', 255);
        table.string('relationshipType', 255);
        table.string('languages', 255);
        table.string('zodiacSign', 255);
        table.string('drinking', 255);
        table.string('smoking', 255);
        table.string('drugs', 255);
        table.string('workout', 255);
        table.string('jobTitle', 255);
        table.string('jobCompany', 255);
        table.string('livingIn', 255);
        table.string('gender', 255);
        table.string('genderCategory', 255);
        table.string('genderPreference', 255);
        table.string('sexualOrientation', 255);

        table.primary('userId');
        table.foreign('userId').references('userId').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('userProfiles');
};
