import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { previous, next, today } from "../utils/date-time";
import { Link } from "react-router-dom";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState([]);

  //get the date from the url query (?date=2022-07-19)
  const urlDate = useQuery().get("date");
  if (urlDate) {
    date = urlDate;
  }

  const readDate = new Date(`${date}`).toDateString();

  useEffect(() => {
    const abortController = new AbortController();
    async function loadDashboard() {
      try {
        setReservationsError([]);
        const reservationsByDate = await listReservations(
          { date },
          abortController.signal
        );
        setReservations(reservationsByDate);
      } catch (error) {
        setReservations([]);
        setReservationsError([error.message]);
      }
    }
    loadDashboard();
    return () => abortController.abort();
  }, [date]);

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
    <main>
      <h1>Dashboard</h1>
      <ErrorAlert error={reservationsError} />
      <div>
        <Link
          to={`/dashboard?date=${previous(date)}`}
          className="btn btn-sm-info"
        >
          Yesterday's Reservations
        </Link>
        <Link to={`/dashboard?date=${today()}`} className="btn btn-sm-info">
          Today's Reservations
        </Link>
        <Link to={`/dashboard?date=${next(date)}`} className="btn btn-sm-info">
          Tomorrow's Reservations
        </Link>
      </div>
      <h4 className="mb-0">Reservations for: {readDate}</h4>
      <div className="table-responsive">
        <table className="table text-center">
          <thead>
            <tr>
              <th scop="col">Reservation #</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Mobile Number</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">Number of People</th>
            </tr>
          </thead>
          <tbody>{tableRows}</tbody>
        </table>
      </div>
    </main>
  );
}

export default Dashboard;
