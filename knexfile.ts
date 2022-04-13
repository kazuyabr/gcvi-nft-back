import type { Knex } from "knex";
require('dotenv-safe').config({
  allowEmptyValues: true
});

const config: { [key: string]: Knex.Config } = {
  development: {
    client: String(process.env.DB_CLIENT),
    connection: {
      host: String(process.env.DB_HOST),
      port: Number(String(process.env.DB_PORT)),
      database: String(process.env.DB_DATABASE),
      user: String(process.env.DB_USER),
      password: String(process.env.DB_PASS)
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: "knex_migrations"
    },
    seeds:{
      directory: './src/database/seeds'
    }
  },

  staging: {
    client: String(process.env.DB_CLIENT),
    connection: {
      host: String(process.env.DB_HOST),
      port: Number(String(process.env.DB_PORT)),
      database: String(process.env.DB_DATABASE),
      user: String(process.env.DB_USER),
      password: String(process.env.DB_PASS)
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: "knex_migrations"
    },
    seeds:{
      directory: './src/database/seeds'
    }
  },

  production: {
    client: String(process.env.DB_CLIENT),
    connection: {
      host: String(process.env.DB_HOST),
      port: Number(String(process.env.DB_PORT)),
      database: String(process.env.DB_DATABASE),
      user: String(process.env.DB_USER),
      password: String(process.env.DB_PASS)
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/database/migrations',
      tableName: "knex_migrations"
    },
    seeds:{
      directory: './src/database/seeds'
    }
  }

}

module.exports = config[String(process.env.NODE_ENV)];
