import React, { useState } from "react";
// import ReservationSeats from "./ReservationSeats";

export default function Reservation({ reservation }) {
  // const [modal, setModal] = useState(false);
  // const toggle = () => setModal(!modal);
  return (
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
              <small className="text-muted">{reservation.mobile_number}</small>
            </p>
          </div>
          <div className="col-2 p-2">
            {reservation.status === "booked" ? (
              <a
                href={`/reservations/${reservation.reservation_id}/seat`}
                className="btn btn-primary btn-sm m-2"
                type="button"
                // onClick={() => toggle()}
              >
                seat
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
            edit
          </a>
          <a
            data-reservation-id-cancel={reservation.reservation_id}
            className="btn btn-secondary btn-sm m-2"
            type="button"
          >
            cancel
          </a>
        </div>
      </div>
    </div>
  );
}
