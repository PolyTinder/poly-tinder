/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('userAliases', function (table) {
        table.string('userAliasId', 50).notNullable();
        table.integer('userId').unsigned().notNullable();
        table.dateTime('expiration').notNullable();

        table.primary(['userAliasId', 'userId']);
        table.foreign('userId').references('userId').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('userAliases');
};
