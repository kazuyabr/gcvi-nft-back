import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transactions', function(table){
        table.increments('id');

        table.string('receive_wallet');
        table.string('sender_wallet');

        table.integer('sender_id').unsigned();
        table.integer('receive_id').unsigned();

        table.string('type');
        table.decimal('amount');
        table.timestamp('created_at').defaultTo(knex.fn.now());

        table.foreign('sender_id').references('id').inTable('users');
        table.foreign('receive_id').references('id').inTable('users');
    });

}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("transactions");
}
