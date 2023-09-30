/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('userValidations', function (table) {
        table.integer('userId').unsigned().notNullable();
        table.boolean('emailValidated').defaultTo(false);
        table.boolean('userProfileReady').defaultTo(false);
        table.boolean('suspended').defaultTo(false);
        table.string('suspensionReason', 255);
        table.boolean('banned').defaultTo(false);

        table.primary('userId');
        table.foreign('userId').references('userId').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('userValidations');
};
