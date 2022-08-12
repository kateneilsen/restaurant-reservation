/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

/*VALIDATION*/

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
  if (people === null || people === 0 || typeof people !== "number") {
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

//validate for update
function hasValidStatus(req, res, next) {
  const { status } = req.body.data;
  const validStatus = ["booked", "seated", "finished"];
  if (!validStatus.includes(status)) {
    return next({
      status: 400,
      message: `Invalid status. Status must be one of: ${validStatus}`,
    });
  }
  next();
}

//validate status
function statusIsBooked(req, res, next) {
  const { status } = req.body.data;
  if (status !== "booked") {
    return next({
      status: 400,
      message: `Reservation has already been created.`,
    });
  }
  next();
}

function statusIsFinished(req, body, next) {
  const { status } = req.body.data;
  if (status === "finished") {
    return next({
      status: 400,
      message: `A finished reservation cannot be updated.`,
    });
  }
  next();
}

/*CRUDL*/

async function list(req, res) {
  const { date } = req.query;
  const { mobile_number } = req.query;
  if (date) {
    let response = await service.list(date);
  }
  if (mobile_number) {
    response = await service.search(mobile_number);
  }
  res.json({ data: response });
}

function read(req, res) {
  const data = res.locals.reservation;
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res) {
  const { reservation_id } = res.locals.reservation;
  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

async function updateStatus(req, res) {
  console.log(res.locals.reservation);
  const { reservation_id } = res.locals.reservation;
  const { status } = req.body.data;
  const data = await service.updateStatus(reservation_id, status);
  res.json({ data });
}

async function destroy(req, res) {
  const { reservation_id } = res.locals.reservation;
  await service.destroy(reservation_id);
  res.sendStatus(204);
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
    statusIsBooked,
    asyncErrorBoundary(create),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    hasValidStatus,
    statusIsFinished,
    asyncErrorBoundary(updateStatus),
  ],
};
