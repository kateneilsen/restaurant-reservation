import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { previous, next, today } from "../utils/date-time";
import { useHistory } from "react-router-dom";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [errors, setErrors] = useState([]);

  const query = useQuery();
  const history = useHistory();

  const urlDate = query.get("date");
  if (urlDate) {
    date = urlDate;
  }

  //format date to make easy to read

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setErrors(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setErrors);
    return () => abortController.abort();
  }

  const tableRows = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <th scope="row">{reservation.reservation_id}</th>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
    </tr>
  ));

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <button
          type="button"
          className="btn btn-info"
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn btn-info"
          onClick={() => history.push(`/dashboard?date=${today()}`)}
        >
          Today
        </button>
        <button
          type="button"
          className="btn btn-info"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          Next
        </button>
      </div>
      <ErrorAlert errors={errors} />
      {/* {JSON.stringify(reservations)} */}
    </div>
  );
}

export default Dashboard;
