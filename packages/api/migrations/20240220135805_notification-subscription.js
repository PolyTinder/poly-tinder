/**
 * * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable(
        'notification-subscription',
        function (table) {
            table.string('endpoint', 255).primary();
            table.string('auth', 255).notNullable();
            table.string('p256dh', 255).notNullable();
            table.string('expirationTime', 255);
            table.integer('userId').unsigned().notNullable();

            table.foreign('userId').references('userId').inTable('users');
        },
    );
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('notification-subscription');
};
