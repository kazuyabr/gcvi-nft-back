import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transactionsoffer', function(table){
        table.increments('id');
        table.integer('user_id').unsigned();
        table.integer('transaction_id').unsigned();
        table.string('name');
        table.decimal('quantity');
        table.decimal('amount');
        table.enu('type',['sell', 'buy']);
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at');
        table.timestamp('deleted_at');
        table.timestamp('closed_at');
        table.foreign('user_id').references('id').inTable('users');
        table.foreign('transaction_id').references('id').inTable('transactions');
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("transactionsoffer");
}
