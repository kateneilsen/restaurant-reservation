const knex = require("../db/connection");

function listByDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot("status", "finished")
    .orderBy("reservation_time");
}

function list() {
  return knex("reservations").select("*").orderBy("reservation_time");
}

function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function create(newReservation) {
  return knex("reservations")
    .insert(newReservation, "*")
    .then((createdRecord) => createdRecord[0]);
}

//changed status from booked to seated
function updateStatus(updatedReservation) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: updatedReservation.reservation_id })
    .update({ status: updatedReservation.status })
    .then((updatedRecord) => updatedRecord[0]);
}

function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

module.exports = {
  list,
  listByDate,
  read,
  create,
  updateStatus,
  search,
};
