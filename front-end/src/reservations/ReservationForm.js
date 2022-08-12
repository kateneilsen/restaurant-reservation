import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function ReservationForm() {
  const initialState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formValues, setFormValues] = useState({ ...initialState });
  const [errors, setErrors] = useState([]);

  const history = useHistory();

  async function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      const responseFromAPI = await createReservation(
        formValues,
        abortController.signal
      );
      history.push(`/dashboard?date=${formValues.reservation_date}`);
      return responseFromAPI;
    } catch (error) {
      setErrors(error);
    }
    return () => abortController.abort();
  }

  function handleNumber({ target }) {
    setFormValues({ ...formValues, [target.name]: Number(target.value) });
  }

  function changeHandler(event) {
    console.log(event.target.name);
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  }

  function cancelHandler() {
    history.goBack();
  }

  // const today = new Date();

  return (
    <div>
      <h1 className="mb-3">Create Reservation</h1>
      <form className="mb-4" onSubmit={submitHandler}>
        <div className="col-6 form-group">
          <div className="row mb-2">
            <label>First Name</label>
            <input
              className="form-control"
              name="first_name"
              type="text"
              required={true}
              value={formValues.first_name}
              onChange={changeHandler}
            />
          </div>

          <div className="row mb-2">
            <label>Last Name:</label>
            <input
              className="form-control"
              name="last_name"
              type="text"
              required={true}
              value={formValues.last_name}
              onChange={changeHandler}
            />
          </div>

          <div className="row mb-2">
            <label>Mobile Number</label>
            <input
              className="form-control"
              name="mobile_number"
              type="text"
              placeholder="000-000-0000"
              required={true}
              value={formValues.mobile_number}
              onChange={changeHandler}
            />
          </div>

          <div className="row mb-2">
            <label>Date</label>
            <input
              className="form-control"
              name="reservation_date"
              type="date"
              required={true}
              value={formValues.reservation_date}
              onChange={changeHandler}
            />
          </div>

          <div className="row mb-2">
            <label>Time</label>
            <input
              className="form-control"
              name="reservation_time"
              type="time"
              required={true}
              value={formValues.reservation_time}
              onChange={changeHandler}
            />
          </div>

          <div className="row mb-2">
            <label>Number of People</label>
            <input
              className="form-control"
              name="people"
              type="number"
              min={1}
              required={true}
              value={formValues.people}
              onChange={handleNumber}
            />
          </div>
          <div className="row mb-2">
            <ErrorAlert errors={errors} />
          </div>

          <button type="submit" className="btn btn-primary m-2">
            Submit
          </button>

          <button
            type="button"
            className="btn btn-secondary m-2"
            onClick={cancelHandler}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
