import React, { useState } from "react";
import "./newRes.css";
import { useHistory } from "react-router-dom";

export default function NewRes() {
  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });

  const history = useHistory();

  function submitHandler(event) {
    event.preventDefault();
    history.push("/");
  }

  function cancelHandler() {
    history.back();
  }

  return (
    <div className="container">
      <div className="title">
        <h1>New Reservation</h1>
      </div>
      <form>
        <label>
          First name:
          <input name="first_name" type="text" />
        </label>
        <br />
        <label>
          Last name:
          <input name="last_name" type="text" />
        </label>
        <br />
        <label>
          Mobile number:
          <input name="mobile_number" type="text" />
        </label>
        <br />
        <label>
          Date of reservation:
          <input name="reservation_date" type="date" />
        </label>
        <br />
        <label>
          Time of reservation:
          <input name="reservation_time" type="time" />
        </label>
        <br />
        <label>
          {/* Number of people must be at least 1 */}
          Number of people:
          <input name="people" type="number" />
        </label>
        <br />
        <div>
          <button type="submit" onClick={submitHandler}>
            Submit
          </button>
          <button type="submit" onClick={cancelHandler}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
