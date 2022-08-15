import React, { useState } from "react";
import { useHistory } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { cancelReservation } from "../utils/api";

export default function Reservation({ reservation }) {
  const [error, setError] = useState(null);
  const history = useHistory();

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
        <div className="card pr-4">
          <div className="card-body">
            <div className="row">
              <div className="col-4">
                <p>{reservation.reservation_time}</p>
              </div>
              <div className="col-6">
                <p className="card-text">
                  {reservation.first_name} {reservation.last_name}
                </p>
                <p className="card-text">People: {reservation.people}</p>
                <p className="card-text">
                  <small className="text-muted">
                    {reservation.mobile_number}
                  </small>
                </p>
                <p data-reservation-id-status={reservation.status}>
                  {reservation.status}
                </p>
              </div>
              <div
                className="col-2 p-2"
                data-reservation-id-status={reservation.reservation_id}
              >
                {reservation.status === "booked" ? (
                  <a
                    href={`/reservations/${reservation.reservation_id}/seat`}
                    className="btn btn-primary btn-sm m-2"
                    type="button"
                  >
                    Seat
                  </a>
                ) : (
                  <p>{reservation.status}</p>
                )}
              </div>
            </div>
            <div className="row">
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
        </div>
      )}
    </>
  );
}
