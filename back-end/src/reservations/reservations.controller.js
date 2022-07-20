/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  console.log(req.query);
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

//validation middleware - request body only includes the valid properties
// function hasOnlyValidProperties(req, res, next) {
//   const { data = {} } = req.body;

//   const invalidFields = Object.keys(data).filter(
//     (field) => !VALID_PROPERTIES.includes(field)
//   );
//   if (invalidFields.length) {
//     return next({
//       status: 400,
//       message: `Invalid field(s): ${invalidFields.join(". ")}`,
//     });
//   }
//   next();
// }

async function create(req, res) {
  console.log(req.body.data);
  const newReservation = req.body.data;
  const data = await service.create(newReservation);
  res.status(201).json(data);
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: asyncErrorBoundary(create),
};
