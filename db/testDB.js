const knex = require("./index");

const testDB = async () => {
  await knex.schema
    .createTable("users", function(table) {
      table.increments("id");
      table.string("user_name");
    })
    .createTable("accounts", function(table) {
      table.increments("id");
      table.string("account_name");
      table
        .integer("user_id")
        .unsigned()
        .references("users.id");
    })
    .then(function() {
      return knex.insert({ user_name: "Tim" }).into("users");
    })
    .then(function(rows) {
      return knex
        .table("accounts")
        .insert({ account_name: "knex", user_id: rows[0] });
    })
    .then(function() {
      return knex("users")
        .join("accounts", "users.id", "accounts.user_id")
        .select("users.user_name as user", "accounts.account_name as account");
    })
    .map(function(row) {
      console.log(row);
    })
    .catch(console.error);

  await knex.raw("DROP TABLE users CASCADE").catch(console.log);
  await knex.raw("DROP TABLE accounts CASCADE").catch(console.log);

  console.log("Database running successfully.");
};

module.exports = testDB;
