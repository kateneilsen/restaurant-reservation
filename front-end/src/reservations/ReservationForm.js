import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";

export default function ReservationForm() {
  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [reservation, setReservation] = useState({ ...initialState });
  const [formErrors, setFormErrors] = useState([]);

  const history = useHistory();

  const submitHandler = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    async function postData() {
      try {
        await createReservation(reservation, abortController.signal);
        history.push(`dashboard?date=${reservation.reservation_date}`);
      } catch (error) {
        setFormErrors([...formErrors, error.message]);
      }
    }
    if (formErrors.length === 0) {
      postData();
    }
  };

  function changeHandler(event) {
    console.log(event.target.name);
    setReservation({ ...reservation, [event.target.name]: event.target.value });
  }

  function cancelHandler() {
    history.goBack();
  }

  return (
    <main>
      <h1 className="mb-3">Create Reservation</h1>
      <form className="mb-4" onSubmit={submitHandler}>
        <div className="row mb-3">
          <div className="col-6 form-group">
            <label>
              First Name
              <input
                className="form-control"
                name="first_name"
                type="text"
                required={true}
                value={reservation.first_name}
                onChange={changeHandler}
              />
            </label>
          </div>
          <div className="row mb-3">
            <label>
              Last Name:
              <input
                className="form-control"
                name="last_name"
                type="text"
                required={true}
                value={reservation.last_name}
                onChange={changeHandler}
              />
            </label>
          </div>
          <div className="row mb-3">
            <label>
              Mobile Number
              <input
                className="form-control"
                name="mobile_number"
                type="text"
                placeholder="000-000-0000"
                required={true}
                value={reservation.mobile_number}
                onChange={changeHandler}
              />
            </label>
          </div>
          <div className="row mb-3">
            <label>
              Date
              <input
                className="form-control"
                name="reservation_date"
                type="date"
                required={true}
                value={reservation.reservation_date}
                onChange={changeHandler}
              />
            </label>
          </div>
          <div className="row mb-3">
            <label>
              Time
              <input
                className="form-control"
                name="reservation_time"
                type="time"
                required={true}
                value={reservation.reservation_time}
                onChange={changeHandler}
              />
            </label>
          </div>
          <div className="row mb-3">
            <label>
              Number of People
              <input
                className="form-control"
                name="people"
                type="number"
                required={true}
                value={reservation.people}
                onChange={changeHandler}
              />
            </label>
          </div>
          <div>
            <button type="submit">Submit</button>
            <button type="submit" onClick={cancelHandler}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
