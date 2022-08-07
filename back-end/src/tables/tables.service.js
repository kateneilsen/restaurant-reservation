const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function create(table) {
  return knex("tables")
    .insert(table, "*")
    .then((createdRecords) => createdRecords[0]);
}

//update table when reservation seated at table
function update(reservation_id, table_id) {
  return knex("reservations")
    .where({ reservation_id })
    .returning("*")
    .then(() => {
      return knex("tables")
        .where({ table_id })
        .update({ reservation_id })
        .returning("*");
    });
}

module.exports = {
  list,
  read,
  create,
  update,
};