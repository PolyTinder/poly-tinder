/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('users', function (table) {
        table.increments('userId').primary();
        table.string('email', 255).notNullable();
        table.string('hash', 255).notNullable();
        table.string('salt', 255).notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('sessions', function (table) {
        table.increments('sessionId').primary();
        table.integer('userId').unsigned().notNullable();
        table.string('description', 255);
        table.timestamp('createdAt').defaultTo(knex.fn.now());

        table.foreign('userId').references('userId').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('sessions');
    await knex.schema.dropTable('users');
};
