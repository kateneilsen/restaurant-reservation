/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

// validate request body
function hasData(req, res, next) {
  const data = req.body.data;
  if (!data) {
    return next({
      status: 400,
      message: `Request body must have data.`,
    });
  }
  next();
}

const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

// //validation middleware - request body only includes the valid properties
function hasOnlyValidProperties(req, res, next) {
  console.log(req.body.data);
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

//US-01 number of people must be at least 1
function hasValidPeople(req, res, next) {
  const people = req.body.data.people;
  if (typeof people === "string" || people <= 0) {
    return next({
      status: 400,
      message: "people must be a number",
    });
  }
  next();
}

//valid date format
function hasValidDate(req, res, next) {
  const date = req.body.data.reservation_date;
  const validDate = /\d{4}-\d{2}-\d{2}/.test(date);
  if (!date || !validDate) {
    next({
      status: 400,
      message: "reservation_date is not valid",
    });
  }
  next();
}

function hasValidDay(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = new Date(`${reservation_date}`);

  const tuesday = 2;

  //get day of the week from reservation date
  const day = date.getUTCDay();
  if (day === tuesday) {
    return next({
      status: 400,
      message:
        "The restaurant is closed on Tuesdays. Please enter a valid day.",
    });
  }
  next();
}

function hasFutureDate(req, res, next) {
  const reservationDate = req.body.data.reservation_date;
  const reservationTime = req.body.data.reservation_time;

  const date = new Date(`${reservationDate} ${reservationTime}`);
  if (new Date() > date) {
    return next({
      status: 400,
      message: "Reservation must be in the future.",
    });
  }
  next();
}

function hasValidTime(req, res, next) {
  const { reservation_time } = req.body.data;
  const validTime = /[0-9]{2}:[0-9]{2}/.test(reservation_time);

  if (!reservation_time || !validTime) {
    return next({
      status: 400,
      message: "reservation_time is not valid.",
    });
  }

  if (reservation_time >= "21:30" || reservation_time <= "10:30") {
    return next({
      status: 400,
      message: "Reservation must be between 10:30am and 9:30pm.",
    });
  }
  next();
}

//GET reservations for a given date
async function list(req, res) {
  const { date } = req.query;
  const response = await service.list(date);
  res.json({ data: response });
}

//validate reservation id
async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `${reservation_id} not found.`,
  });
}

//GET reservation by id
function read(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}

//POST new reservation
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  create: [
    hasData,
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasValidPeople,
    hasValidDate,
    hasValidDay,
    hasFutureDate,
    hasValidTime,
    asyncErrorBoundary(create),
  ],
};
