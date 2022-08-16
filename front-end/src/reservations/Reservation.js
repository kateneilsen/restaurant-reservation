import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { cancelReservation } from "../utils/api";

export default function Reservation({ reservation }) {
  const [error, setError] = useState(null);
  const history = useHistory();

  let [hours, minutes] = `${reservation.reservation_time}`.split(":");

  const amOrPm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  const time = `${hours}:${minutes} ${amOrPm}`;

  async function handleCancel(reservationId) {
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      try {
        await cancelReservation(reservation.reservation_id);
        history.go();
      } catch (error) {
        setError(error);
      }
    }
  }
  return (
    <>
      <ErrorAlert error={error} />

      {reservation.status !== "finished" && reservation.status !== "cancelled" && (
        <li className="list-group-item">
          <div className="row">
            <div className="col-3">
              <p className="">{time}</p>
            </div>
            <div className="col-5">
              <h5 className="fw-bold ">
                {reservation.first_name} {reservation.last_name}
              </h5>
              <p className="text-muted mb-0">{reservation.mobile_number}</p>
              <p className="text-muted mb-0">
                <u>Number of People:</u> {reservation.people}
              </p>
            </div>
            <div className="col-4">
              <p
                className="text-muted mb-0"
                data-reservation-id-status={`${reservation.reservation_id}`}
              >
                <u>status:</u> {reservation.status}
              </p>

              {reservation.status === "booked" && (
                <a
                  href={`/reservations/${reservation.reservation_id}/seat`}
                  className="btn btn-info btn-sm m-2"
                  type="button"
                >
                  Seat
                </a>
              )}
              <a
                href={`/reservations/${reservation.reservation_id}/edit`}
                className="btn btn-secondary btn-sm m-2"
              >
                Edit
              </a>
              <button
                data-reservation-id-cancel={reservation.reservation_id}
                className="btn btn-secondary btn-sm m-2"
                onClick={() => handleCancel(reservation.reservation_id)}
              >
                Cancel
              </button>
            </div>
          </div>
        </li>
      )}
    </>
  );
}
