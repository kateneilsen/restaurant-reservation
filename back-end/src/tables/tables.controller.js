const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

//US-04 valid table properties
const validProperties = ["table_name", "capacity", "reservation_id"];

function hasValidProperties(req, res, next) {
  const invalidFields = Object.keys(req.body.data).filter(
    (field) => !validProperties.includes(field)
  );
  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

//validate request body has required fields
const hasRequiredProperties = hasProperties("table_name", "capacity");
const hasResIdProperty = hasProperties("reservation_id");

function hasData(req, res, next) {
  const { data } = req.body;
  if (data) {
    return next();
  }
  next({
    status: 400,
    message: `Data is missing`,
  });
}

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `${table} does not exist.` });
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  if (!reservation_id) {
    return next({
      status: 400,
      message: `a reservation_id is required`,
    });
  }
  const reservation = await reservationsService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    return next({
      status: 404,
      message: `Reservation cannot be found ${reservation_id}`,
    });
  }
}

//US-04 table validations
function validTableName(req, res, next) {
  const { table_name } = req.body.data;
  const length = table_name.length;

  if (length >= 2) {
    return next();
  }
  return nect({
    status: 400,
    message: "table_name must be at least 2 characters long.",
  });
}

function validCapacity(req, res, next) {
  const { capacity } = req.body.data;
  if (!Number.isInteger(capacity)) {
    return next({
      status: 400,
      message: "Table capacity must be at least 1.",
    });
  }
  next();
}

//check if table is  occupied
function occupiedTable(req, res, next) {
  const occupied = res.locals.table.reservation_id;
  if (occupied) {
    return next({
      status: 400,
      message: `The selected table ${res.locals.table.table_id} is occupied. Choose another table.`,
    });
  }
  next();
}

//make sure table will fit number of people for reservation
function sufficientCapacity(req, res, next) {
  const capacity = res.locals.table.capacity;
  const people = res.locals.reservation.people;
  if (people > capacity) {
    return next({
      status: 400,
      message: `Table capacity is less than number of people. Select a table with a capacity that is equal to or greater than the number of people. `,
    });
  }
  next();
}

//CRUD

async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

function read(req, res) {
  const data = res.locals.table;
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function update(req, res) {
  const { reservation_id } = req.body.data;
  const table_id = Number(req.params.table_id);
  const data = await service.update(reservation_id, table_id);
  res.json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasValidProperties,
    hasRequiredProperties,
    validTableName,
    validCapacity,
    asyncErrorBoundary(create),
  ],
  update: [
    hasData,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableExists),
    hasResIdProperty,
    occupiedTable,
    sufficientCapacity,
    asyncErrorBoundary(update),
  ],
};
