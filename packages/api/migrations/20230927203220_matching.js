/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('swipes', function (table) {
        table.integer('activeUserId').unsigned().notNullable();
        table.integer('targetUserId').unsigned().notNullable();
        table.boolean('liked').notNullable();
        table.dateTime('swipeTime').defaultTo(knex.fn.now());

        table.primary(['activeUserId', 'targetUserId']);
        table.foreign('activeUserId').references('userId').inTable('users');
        table.foreign('targetUserId').references('userId').inTable('users');
    });

    await knex.schema.createTable('matches', function (table) {
        table.integer('user1Id').unsigned().notNullable();
        table.integer('user2Id').unsigned().notNullable();
        table.dateTime('matchTime').defaultTo(knex.fn.now());
        table.boolean('unmatched').defaultTo(false);
        table.integer('unmatchedUserId').unsigned();
        table.dateTime('unmatchedTime');

        table.primary(['user1Id', 'user2Id']);
        table.foreign('user1Id').references('userId').inTable('users');
        table.foreign('user2Id').references('userId').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('matches');
    await knex.schema.dropTable('swipes');
};
