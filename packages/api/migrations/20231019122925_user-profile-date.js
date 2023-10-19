/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.alterTable('userProfiles', (table) => {
        table.timestamp('createdAt').nullable().defaultTo(knex.fn.now());
        table.timestamp('updatedAt').nullable().defaultTo(knex.fn.now());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.alterTable('userProfiles', (table) => {
        table.dropColumn('createdAt');
        table.dropColumn('updatedAt');
    });
};
