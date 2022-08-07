const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

//US-04 GET -- list tables by name
async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

//US-04 GET table by id
function read(req, res) {
  const table = res.locals.table;
  res.json(data);
}
//US-04 POST -- create new table
async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

//US-04 valid table properties
const VALID_PROPERTIES = ["table_name", "capacity"];

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
  const tableName = req.body.data.table_name;
  if (tableName.length < 2 || !tableName) {
    return next({
      status: 400,
      message: "Table name must be at least 2 characters long.",
    });
  }
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
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const reservation = await reservationsService.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    return next({
      status: 404,
      message: `${reservation_id} cannot be found.`,
    });
  }
}

//make sure table will fit number of people for reservation
function checkCapacityForRes(req, res, next) {
  const capacity = res.locals.table.capacity;
  //need to store table reservation party size & compare compacity to party size
}
//check if table is free

//check if table is occupied

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `${table} cannot be found.` });
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(tableExists), read],
  create: [
    hasRequiredProperties,
    hasData,
    validTableName,
    validCapacity,
    asyncErrorBoundary(create),
  ],
};
