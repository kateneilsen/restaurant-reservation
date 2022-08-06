const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

//US-04 valid table properties
const VALID_PROPERTIES = ["table_name", "capacity"];

//check whether request body contains a specified set of allowed fields
function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
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
const hasRequiredProperties = hasProperties(VALID_PROPERTIES);

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
  if (tableName.length < 2) {
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
}

//

function checkCapacityForRes(req, res, next) {
  const capacity = res.locals.table.capacity;
  //need to store table reservation party size & compare compacity to party size
}

//US-04 GET -- list tables by name
async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

async function tableExists(req, res, next) {
  const table = await service.read(req.params.table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: "Table cannot be found." });
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

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(tableExists), read],
  create: [
    hasOnlyValidProperties,
    hasRequiredProperties,
    hasData,
    asyncErrorBoundary(create),
  ],
};
