/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//validate request body
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

//validation middleware - request body only includes the valid properties
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

//validation middleware - number of people must be at least 1
function hasValidPeople(req, res, next) {
  const people = Number(req.body.data.people);
  if (!people) {
    return next({
      status: 400,
      message: "Number of people must be at least 1.",
    });
  }
  next();
}

//US-02 validate reservation date: Restaurant is closed on Tuesdays
function hasValidWeekday(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = new Date(`${reservation_date}`);

  const tuesday = 2;

  //get day of the week from reservation date
  const weekday = date.getUTCDay();
  console.log("reservation weekday:", weekday);

  if (weekday === tuesday) {
    next({ status: 400, message: "Restaurant is closed on Tuesdays." });
  }
  next();
}

//US-02 validate reservation date: Reservation date cannot be in the past
function hasFutureDate(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = new Date(`${reservation_date}`);
  console.log("reservation date:", date);

  const tuesday = 2;

  //get day of the week from reservation date
  const weekday = date.getUTCDay();
  // console.log("reservation weekday:", weekday);

  const now = new Date();
  console.log("now:", now);

  const currentDate = new Date().getTime();
  // console.log("today's date", currentDate);

  const resDate = new Date(reservation_date).getTime();
  // console.log("reservation date:", date);

  if (weekday === tuesday && resDate < currentDate) {
    next({
      status: 400,
      message:
        "Please enter a valid date and time. The restaurant is closed on Tuesdays and only future reservations are allowed.",
    });
  }
  if (weekday === tuesday && resDate >= currentDate) {
    next({
      status: 400,
      message: "Restaurant is closed on Tuesdays.",
    });
  }
  if (weekday !== tuesday && resDate < currentDate) {
    next({
      status: 400,
      message: "Only future reservations are allowed.",
    });
  }
  next();
}

//US-03 validate reservation time
//reservation cannot be earlier than 10:30 AM or later than 9:30 PM
//reservation date & time combination cannot be in the past
function hasValidTime(req, res, next) {
  const { reservation_time } = req.body.data;

  const openTime = 1030;
  const closeTime = 2130;

  const reservationTime =
    reservation_time.substring(0, 2) + reservation_time.substring(3);
  if (reservation > openTime && reservation < close) {
    return next();
  } else {
    return next({
      status: 400,
      message: "Reservation must be between 10:30am and 9:30pm",
    });
  }
}

//GET reservations for a given date
async function list(req, res) {
  const { date } = req.query;
  const response = await service.list(date);
  res.json({ data: response });
}

//POST new reservation
async function create(req, res) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({ data: newReservation });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasOnlyValidProperties,
    hasValidPeople,
    hasFutureDate,
    hasValidTime,
    asyncErrorBoundary(create),
  ],
};
