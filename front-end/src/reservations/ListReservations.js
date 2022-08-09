import React, { useState, useEffect } from "react";

import Reservation from "./Reservation";

export default function ListReservations({ reservations }) {
  return (
    <div className="mt-4">
      <h4>Reservations</h4>
      {reservations.map((reservation) => (
        <Reservation
          reservation={reservation}
          key={reservation.reservation_id}
        />
      ))}
    </div>
  );
}
