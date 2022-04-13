const config = require('../../knexfile.ts')
const knex = require('knex')(config)

knex.migrate.latest([config])
module.exports = knex