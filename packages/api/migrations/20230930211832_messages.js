/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('messages', function (table) {
        table.increments('messageId');
        table.integer('senderId').unsigned().notNullable();
        table.integer('recipientId').unsigned().notNullable();
        table.string('content', 255);
        table.timestamp('timestamp').defaultTo(knex.fn.now());

        table.primary(['messageId', 'senderId', 'recipientId']);
        table.foreign('senderId').references('userId').inTable('users');
        table.foreign('recipientId').references('userId').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('messages');
};
