import React from "react";

export default function ReservationForm({
  formValues,
  submitHandler,
  handleNumber,
  changeHandler,
  history,
}) {
  function cancelHandler() {
    history.goBack();
  }

  return (
    <div>
      <h1 className="mb-3">Create Reservation</h1>
      <form className="mb-4" onSubmit={submitHandler}>
        <div className="col-6 form-group">
          <div className="row mb-2">
            <label>First Name</label>
            <input
              id="first_name"
              placeholder="First Name"
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
              id="last_name"
              placeholder="Last Name"
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
              id="mobile_number"
              placeholder="(---) --- ----"
              className="form-control"
              name="mobile_number"
              type="text"
              required={true}
              value={formValues.mobile_number}
              onChange={changeHandler}
            />
          </div>

          <div className="row mb-2">
            <label>Date</label>
            <input
              id="reservation_date"
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
              id="reservation_time"
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
              id="people"
              className="form-control"
              name="people"
              type="number"
              placeholder="1"
              min={1}
              required={true}
              value={formValues.people}
              onChange={handleNumber}
            />
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
        <div className="row mb-2"></div>
      </form>
    </div>
  );
}
