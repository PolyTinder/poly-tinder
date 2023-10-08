/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('verificationTokens', (table) => {
        table.increments('verificationTokenId').primary();
        table.string('token').notNullable();
        table.string('tokenKey').notNullable();
        table.string('tokenType').notNullable();
        table.boolean('isUsed').defaultTo(false);
        table.timestamp('created_at').defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('verificationTokens');
};
