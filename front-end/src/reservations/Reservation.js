import React from "react";

export default function Reservation({ reservation }) {
  return (
    <div>
      <div>Reservation #: {reservation.reservation_id}</div>
      <div className="card-body">
        <div className="row">
          <p className="col-4">{reservation.reservation_time}</p>
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
            <a
              href={`/reservations/${reservation.reservation_id}/seat`}
              className="btn btn-primary btn-sm"
            >
              Seat
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
