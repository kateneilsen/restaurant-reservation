/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const { date } = req.query;
  const data = await service.list(date);
  res.json({ data });
}

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

//

async function create(req, res) {
  const newReservation = req.body.data;
  const data = await service.create(newReservation);
  res.status(201).json(data);
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
};
