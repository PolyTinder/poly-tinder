/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('admin', (table) => {
        table.increments('adminId').primary();
        table.integer('userId').unsigned().notNullable().unique();
    });

    await knex.schema.createTable('userVisibility', (table) => {
        table.integer('userId').unsigned().notNullable().unique();
        table.boolean('visible').notNullable().defaultTo(true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTable('admin');
    await knex.schema.dropTable('userVisibility');
};
