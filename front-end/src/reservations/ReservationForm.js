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
  const date = `${formValues.reservation_date}`.substring(0, 10);

  return (
    <div>
      <form className="mb-4" onSubmit={submitHandler}>
        <div className="col-6 form-group">
          <div className="form-group row mb-2">
            <label htmlFor="first_name">First Name</label>
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

          <div className="form-group row mb-2">
            <label htmlFor="last_name">Last Name:</label>
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

          <div className="form-group row mb-2">
            <label htmlFor="mobile_number">Mobile Number</label>
            <input
              id="mobile_number"
              placeholder="--- --- ----"
              className="form-control"
              name="mobile_number"
              type="number"
              required={true}
              value={formValues.mobile_number}
              onChange={changeHandler}
            />
          </div>

          <div className="form-group row mb-2">
            <label htmlFor="reservation_date">Date</label>
            <input
              id="reservation_date"
              className="form-control"
              pattern="\d{4}-\d{2}-\d{2}"
              name="reservation_date"
              type="date"
              required={true}
              value={date}
              onChange={changeHandler}
            />
          </div>

          <div className="form-group row mb-2">
            <label htmlFor="reservation_time">Time</label>
            <input
              id="reservation_time"
              pattern="[0-9]{2}:[0-9]{2}"
              className="form-control"
              name="reservation_time"
              type="time"
              required={true}
              value={formValues.reservation_time}
              onChange={changeHandler}
            />
          </div>

          <div className="form-group row mb-2">
            <label htmlFor="people">Number of People</label>
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
