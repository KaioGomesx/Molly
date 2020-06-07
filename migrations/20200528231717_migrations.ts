import * as Knex from "knex";

export const config = { transaction: false };

export async function up(knex: Knex): Promise<any> {
    return knex.schema.createTable("users", (table) => {
        table.increments("id");
        table.string("rankingName").notNullable().unique();
        table.string("trollLevel").notNullable();
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.dropTable("users");
}
