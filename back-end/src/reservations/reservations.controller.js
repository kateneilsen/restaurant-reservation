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

//US-01 number of people must be at least 1
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
  const { reservation_date } = req.body.data;
  const { reservation_time } = req.body.data;

  const currentDate = new Date().toLocaleString("en-US", {
    timeZone: "America/New_York",
  });
  console.log("current", currentDate);
  const date = new Date(reservation_date);

  const resYear = date.getFullYear();
  const resMonth = date.getMonth();
  const resDay = date.getDate();
  let [resHours, resMinutes] = reservation_time.split(":");
  // resHours = Number(resHours);
  // resMinutes = Number(resMinutes);

  const reservation = new Date(
    resYear,
    resMonth,
    resDay,
    resHours,
    resMinutes,
    0,
    0
  ).toLocaleString();
  console.log("****", reservation);
  if (reservation > currentDate) {
    next();
  } else {
    return next({
      status: 400,
      message: "Reservation must be in the future.",
    });
  }
}

function hasValidTime(req, res, next) {
  const { reservation_time } = req.body.data;
  //open time is 10:30 am - get total minutes
  const open = 630;
  //close time is 9:30 pm (21:30) get total minutes
  const close = 1290;
  let [resHours, resMinutes] = reservation_time.split(":");
  console.log(resHours);
  resHours = Number(resHours);
  resMinutes = Number(resMinutes);
  const resInMinutes = resHours * 60 + resMinutes;

  if (resInMinutes >= open && resInMinutes <= close) {
    next();
  } else {
    return next({
      status: 400,
      message: "Reservation must be between 10:30am and 9:30pm.",
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
    hasValidDay,
    hasFutureDate,
    hasValidTime,
    asyncErrorBoundary(create),
  ],
};
