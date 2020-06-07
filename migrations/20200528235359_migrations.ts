import * as Knex from "knex";

export const config = { transaction: false };

export async function up(knex: Knex): Promise<any> {
    return knex.schema.table("users", (a) => {
        a.string("nickname").notNullable().unique();
    });
}

export async function down(knex: Knex): Promise<any> {
    return knex.schema.table("users", function (t) {
        t.dropColumn("nickname");
    });
}
