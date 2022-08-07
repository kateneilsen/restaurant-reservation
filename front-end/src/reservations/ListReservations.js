import React from "react";
import { Link } from "react-router-dom";

export default function ListReservations({ reservations, tables }) {
  return (
    <div className="mt-4">
      <h4>Reservations</h4>
      {reservations.map((reservation) => (
        <div key={reservation.reservation_id} className="card pr-2 pl-0">
          <div className="card-body">
            <div className="row">
              <p className="col-4">{reservation.reservation_time}</p>
              <div className="col-6">
                <p className="card-text">
                  {reservation.first_name} {reservation.last_name}
                </p>
                <p className="card-text">Party Size: {reservation.people}</p>
                <p className="card-text">
                  <small className="text-muted">
                    {reservation.mobile_number}
                  </small>
                </p>
              </div>
              <div className="col-2 p-2">
                <Link
                  to={`/reservations/${reservation.reservation_id}/seat`}
                  className="btn btn-primary btn-sm"
                >
                  Seat
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
