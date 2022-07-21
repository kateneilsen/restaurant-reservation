import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { previous, next, today } from "../utils/date-time";
import { useHistory } from "react-router-dom";
import ListReservations from "../reservations/ListReservations";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [errors, setErrors] = useState([]);

  //store query date in state so that it is formatted correctly
  // const [displayDate, setDisplayDate] = useState("");

  const query = useQuery();
  const history = useHistory();

  const urlDate = query.get("date");
  if (urlDate) {
    date = urlDate;
  }

  useEffect(loadDashboard, [date]);

  // //format date to make easy to read
  // useEffect(() => {
  //   if (urlDate) {
  //     let newDate = urlDate.toUTCString();
  //     setDisplayDate(newDate);
  //   } else {
  //     let newDate = new Date(date).toDateString();
  //     setDisplayDate(newDate);
  //   }
  // });

  function loadDashboard() {
    const abortController = new AbortController();
    setErrors(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setErrors);
    return () => abortController.abort();
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <button
          type="button"
          className="btn btn-info m-2"
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        >
          <span className="bi bi-arrow-left-square-fill"></span>
        </button>
        <button
          type="button"
          className="btn btn-info m-2"
          onClick={() => history.push(`/dashboard?date=${today()}`)}
        >
          Today
        </button>
        <button
          type="button"
          className="btn btn-info m-2"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          <span className="bi bi-arrow-right-square-fill"></span>
        </button>
      </div>
      <h2>Reservations for: {date}</h2>
      <ListReservations reservations={reservations} />

      <ErrorAlert errors={errors} />
      {/* {JSON.stringify(reservations)} */}
    </div>
  );
}

export default Dashboard;
