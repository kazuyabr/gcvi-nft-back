import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', function(table){
        table.increments('id');
        table.string('first_name', 255).notNullable();
        table.string('last_name', 255).notNullable();
        table.string('user_name', 255).notNullable();
        table.string('password');
        table.string('email').unique();
        table.string('walletHash', 255).unique();
        table.boolean('verify_email').defaultTo('false');
        table.boolean('admin').defaultTo('false');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('update_at');
        table.timestamp('deleted_at');
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("users");
}
