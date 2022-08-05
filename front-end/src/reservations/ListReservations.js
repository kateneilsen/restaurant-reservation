import React from "react";

export default function ListReservations({ reservations }) {
  function seatHandler() {}

  const tableRows = reservations.map((reservation) => (
    <tr key={reservation.reservation_id}>
      <th scope="row">{reservation.reservation_id}</th>
      <td>{reservation.first_name}</td>
      <td>{reservation.last_name}</td>
      <td>{reservation.mobile_number}</td>
      <td>{reservation.reservation_date}</td>
      <td>{reservation.reservation_time}</td>
      <td>{reservation.people}</td>
      <td>
        <button type="button" className="btn btn-primary">
          Seat
        </button>
      </td>
    </tr>
  ));
  return (
    <div class="g-col-8">
      <table className="table text-center">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">First Name</th>
            <th scope="col">Last Name</th>
            <th scope="col">Mobile Number</th>
            <th scope="col">Date</th>
            <th scope="col">Time</th>
            <th scope="col">Party Size</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody className="text-">{tableRows}</tbody>
      </table>
    </div>
  );
}
