/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.alterTable('reports', (table) => {
        table.dropForeign('userId');
        table.dropForeign('reportedUserId');
        table.dropColumn('userId');
        table.dropColumn('reportedUserId');
        table.string('reportingUserEmail').notNullable();
        table.string('reportedUserEmail').notNullable();
    });

    await knex.schema.alterTable('blocks', (table) => {
        table.dropForeign('userId');
        table.dropForeign('blockedUserId');
        table.dropColumn('userId');
        table.dropColumn('blockedUserId');
        table.string('blockingUserEmail').notNullable();
        table.string('blockedUserEmail').notNullable();
    });

    await knex.schema.createTable('banned', (table) => {
        table.increments('bannedId').primary();
        table.string('email').notNullable();
        table.string('reason');
        table.timestamps(true, true);
    });

    await knex.schema.createTable('suspend', (table) => {
        table.increments('suspendId').primary();
        table.string('email').notNullable();
        table.string('reason');
        table.timestamp('until').notNullable();
        table.timestamps(true, true);
    });

    await knex.schema.alterTable('userValidations', (table) => {
        table.dropColumn('suspensionReason');
        table.dropColumn('banned');
        table.dropColumn('suspended');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.alterTable('userValidations', (table) => {
        table.boolean('banned').defaultTo(false);
        table.boolean('suspended').defaultTo(false);
        table.string('suspensionReason', 255);
    });

    await knex.schema.dropTableIfExists('suspend');
    await knex.schema.dropTableIfExists('banned');

    await knex.schema.alterTable('reports', (table) => {
        table.dropColumn('reportingUserEmail');
        table.dropColumn('reportedUserEmail');
        table.integer('userId').unsigned().notNullable();
        table.integer('reportedUserId').unsigned().notNullable();
        table.foreign('userId').references('userId').inTable('users');
        table.foreign('reportedUserId').references('userId').inTable('users');
    });

    await knex.schema.alterTable('blocks', (table) => {
        table.dropColumn('blockingUserEmail');
        table.dropColumn('blockedUserEmail');
        table.integer('userId').unsigned().notNullable();
        table.integer('blockedUserId').unsigned().notNullable();
        table.foreign('userId').references('userId').inTable('users');
        table.foreign('blockedUserId').references('userId').inTable('users');
    });
};
