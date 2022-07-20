/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

//validation middleware - request body only includes the valid properties
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(". ")}`,
    });
  }
  next();
}

//validation middleware - number of people must be at least 1
function hasValidPeople(req, res, next) {
  const people = Number(req.body.data.people);
  if (people >= 1) {
    return next();
  }
  next({ status: 400, message: "Number of people must be at least 1." });
}

//US-02 validate reservation date: Restaurant is closed on Tuesdays
function hasValidWeekday(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = new Date(`${reservation_date}`);

  const tuesday = 2;

  //get day of the week from reservation date
  const weekday = date.getUTCDay();

  if (weekday !== tuesday) {
    return next();
  }
  next({ status: 400, message: "Restaurant is closed on Tuesdays." });
}

//US-02 validate reservation date: Reservation date cannot be in the past
function hasValidDate(req, res, next) {
  let currentDate = Date.now();
  currentDate = new Date(currentDate);
  console.log("current date", currentDate);

  const { reservation_date } = req.body.data;
  const date = new Date(`${reservation_date}`);
  console.log("reservation date", date);

  if (date >= currentDate) {
    return next();
  } else {
    return next({
      status: 400,
      message: "Reservation must be for a future date.",
    });
  }
}

//GET reservations for a given date
async function list(req, res) {
  const { date } = req.query;
  const data = await service.list(date);
  res.json({ data });
}

//POST new reservation
async function create(req, res) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({ data: newReservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasOnlyValidProperties,
    hasValidPeople,
    hasValidWeekday,
    hasValidDate,
    asyncErrorBoundary(create),
  ],
};
