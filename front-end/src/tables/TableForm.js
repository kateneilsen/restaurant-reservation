import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

export default function TableForm() {
  const [formValues, setFormValues] = useState({
    table_name: "",
    capacity: "",
  });

  const [errors, setErrors] = useState([]);

  const history = useHistory();

  function cancelHandler() {
    history.goBack();
  }

  function changeHandler(event) {
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  }

  async function submitHandler(event) {
    event.preventDefault();
    setErrors([]);
    const abortController = new AbortController();
    formValues.capacity = Number(formValues.capacity);
    try {
      await createTable(formValues, abortController.signal);
      history.push("/dashboard");
    } catch (error) {
      if (error.name !== "AbortError") {
        setErrors(error);
      }
    }
    return () => abortController.abort();
  }

  return (
    <div>
      <h1 className="mb-3">Create Table</h1>
      <form onSubmit={submitHandler} className="mb-4">
        <div className="col-6 form-group">
          <div className="row mb-2">
            <label>Table Name</label>
            <input
              id="table_name"
              className="form-control"
              name="table_name"
              type="text"
              required={true}
              placeholder="Table Name"
              value={formValues.table_name}
              onChange={changeHandler}
            />
          </div>
          <div className="row mb-2">
            <label>Capacity</label>
            <input
              id="capacity"
              className="form-control"
              name="capacity"
              type="number"
              min={1}
              required={true}
              placeholder="1"
              value={formValues.capacity}
              onChange={changeHandler}
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
        <ErrorAlert error={errors} />
      </form>
    </div>
  );
}
