/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('reports', (table) => {
        table.increments('reportId').primary();
        table.integer('userId').unsigned().notNullable();
        table.integer('reportedUserId').unsigned().notNullable();
        table.string('reportType').notNullable();
        table.string('description');
        table.boolean('reviewed').defaultTo(false);
        table.timestamps(true, true);

        table.foreign('userId').references('userId').inTable('users');
        table.foreign('reportedUserId').references('userId').inTable('users');
    });

    await knex.schema.createTable('blocks', (table) => {
        table.increments('blockId').primary();
        table.integer('userId').unsigned().notNullable();
        table.integer('blockedUserId').unsigned().notNullable();
        table.timestamps(true, true);

        table.foreign('userId').references('userId').inTable('users');
        table.foreign('blockedUserId').references('userId').inTable('users');
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('reports');
    await knex.schema.dropTableIfExists('blocks');
};
