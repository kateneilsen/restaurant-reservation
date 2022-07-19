import React from "react";

export default function ViewReservations({ reservations }) {
  return (
    <div>
      <button>Previous</button>
      <button>Today</button>
      <button>Next</button>
      <div>
        <ul>
          {reservations.map((reservation) => (
            <li key={reservation.id}>{reservation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
