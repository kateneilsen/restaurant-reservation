import React from "react";
import Reservation from "./Reservation";

export default function ListReservations({ reservations }) {
  return (
    <ul className="list-group">
      {reservations.map((reservation) => (
        <Reservation
          reservation={reservation}
          key={reservation.reservation_id}
        />
      ))}
    </ul>
  );
}
