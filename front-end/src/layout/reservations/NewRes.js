import React, { useState } from "react";
import "./reservations.css";
import { useHistory } from "react-router-dom";
import { createReservation } from "../../utils/api";

export default function NewRes({ reservations }) {
  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [reservation, setReservation] = useState({ ...initialState });

  const history = useHistory();

  async function submitHandler(event) {
    event.preventDefault();
    // console.log(reservation);
    await createReservation(reservation);
    validate(formValues);
    history.push("/dashboard");
  }

  function changeHandler(event) {
    setReservation({ ...reservation, [event.target.name]: event.target.value });
    // console.log(reservation);
  }

  function cancelHandler() {
    history.goBack();
  }
  return (
    <div className="container">
      <div className="row">
        <div className="title">
          <h1>New Reservation</h1>
        </div>
        <form onSubmit={submitHandler}>
          <label>
            First name:
            <input
              className="form-control"
              name="first_name"
              type="text"
              value={reservation.first_name}
              onChange={changeHandler}
            />
          </label>
          <br />
          <label>
            Last name:
            <input
              className="form-control"
              name="last_name"
              type="text"
              value={reservation.last_name}
              onChange={changeHandler}
            />
          </label>
          <br />
          <label>
            Mobile number:
            <input
              className="form-control"
              name="mobile_number"
              type="text"
              value={reservation.mobile_number}
              onChange={changeHandler}
            />
          </label>
          <br />
          <label>
            Date of reservation:
            <input
              className="form-control"
              name="reservation_date"
              type="date"
              value={reservation.reservation_date}
              onChange={changeHandler}
            />
          </label>
          <br />
          <label>
            Time of reservation:
            <input
              className="form-control"
              name="reservation_time"
              type="time"
              value={reservation.reservation_time}
              onChange={changeHandler}
            />
          </label>
          <br />
          <label>
            Number of people:
            <input
              className="form-control"
              name="people"
              type="number"
              value={reservation.people}
              onChange={changeHandler}
            />
          </label>
          <br />
          <div>
            <button type="submit">Submit</button>
            <button type="submit" onClick={cancelHandler}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
