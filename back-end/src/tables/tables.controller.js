const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

//US-04 valid table properties
const VALID_PROPERTIES = ["table_name", "capacity", "reservation_id"];

function hasValidProperties(req, res, next) {
  const invalidFields = Object.keys(req.body.data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
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

//validate data
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

//US-04 table validations
function validTableName(req, res, next) {
  const { table_name } = req.body.data;
  if (table_name.length < 2 || !table_name) {
    return next({
      status: 400,
      message: `Table name must be at least 2 characters long.`,
    });
  }
  next();
}

function validCapacity(req, res, next) {
  const { capacity } = req.body.data;
  if (capacity <= 0) {
    return next({
      status: 400,
      message: "Table capacity must be at least 1.",
    });
  }
  if (typeof capacity !== "number") {
    return next({
      status: 400,
      message: "Table capacity must be a number.",
    });
  }
  next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationsService.read(reservation_id);
  console.log(reservation_id);
  if (!reservation_id) {
    return next({
      status: 400,
      message: "A reservation id is required",
    });
  }
  if (!reservation) {
    return next({
      status: 404,
      message: `Reservation cannot be found.`,
    });
  }
  next();
}

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `${table} does not exist.` });
}

//check if table is free or occupied
function occupiedTable(req, res, next) {
  const occupied = res.locals.table.reservation_id;
  if (occupied) {
    return next({
      status: 400,
      message: "Selected table is occupied. Select a different table.",
    });
  }
  next();
}

//check if table is unoccupied
function notOccupied(req, res, next) {
  const table = res.locals.table;
  if (table.reservation_id === null) {
    return next({
      status: 400,
      message: `Table is not occupied.`,
    });
  }
  next();
}

//make sure table will fit number of people for reservation
function sufficientCapacity(req, res, next) {
  const { capacity } = res.locals.table;
  const { people } = res.locals.reservation;
  console.log("people:", people, typeof people);
  console.log("capacity:", capacity, typeof capacity);
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
  read: [asyncErrorBoundary(tableExists), read],
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
    hasRequiredProperties,
    occupiedTable,
    notOccupied,
    sufficientCapacity,
    asyncErrorBoundary(update),
  ],
};
