import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { previous, next, today } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import ListReservations from "../reservations/ListReservations";
import ListTables from "../tables/ListTables";
const dayjs = require("dayjs");

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [errors, setErrors] = useState([]);

  const query = useQuery();
  const history = useHistory();

  const urlDate = query.get("date");
  if (urlDate) {
    date = urlDate;
  }

  useEffect(loadDashboard, [date]);
  useEffect(loadTables, []);

  function loadDashboard() {
    const abortController = new AbortController();
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setErrors);
    return () => abortController.abort();
  }

  function loadTables() {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setErrors);
    return () => abortController.abort();
  }

  return (
    <div>
      <div className="container">
        <h1 className="mt-3">Dashboard</h1>
        <div className="btn-group btn-group-lg mt-4" role="group">
          <button
            type="button"
            className="btn btn-info"
            onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
          >
            <span className="bi bi-arrow-left-square-fill"></span>
          </button>
          <button
            type="button"
            className="btn btn-info"
            onClick={() => history.push(`/dashboard?date=${today()}`)}
          >
            {dayjs(date).format("MM-DD-YYYY")}
          </button>
          <button
            type="button"
            className="btn btn-info "
            onClick={() => history.push(`/dashboard?date=${next(date)}`)}
          >
            <span className="bi bi-arrow-right-square-fill"></span>
          </button>
        </div>
        {/* <h2>Reservations for: {date}</h2> */}

        <div className="row">
          <div className="col-8">
            <h4 className="fw-bold mt-4 ml-2">Reservations</h4>
            <ListReservations reservations={reservations} tables={tables} />
          </div>

          <div className="col-4">
            <h4 className="fw-bold mt-4 ml-2">Tables</h4>
            <ListTables tables={tables} />
          </div>
        </div>
      </div>
      <ErrorAlert errors={errors} />
      {/* {JSON.stringify(reservations)} */}
    </div>
  );
}

export default Dashboard;
