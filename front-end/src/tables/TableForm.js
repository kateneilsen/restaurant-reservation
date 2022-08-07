import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

export default function TableForm() {
  const initialState = {
    table_name: "",
    capacity: "",
  };

  const [formValues, setFormValues] = useState({ ...initialState });
  const [errors, setErrors] = useState([]);

  const history = useHistory();

  function cancelHandler() {
    history.goBack();
  }

  function changeHandler(event) {
    console.log(event.target.name);
    setFormValues({ ...formValues, [event.target.name]: event.target.value });
  }

  async function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    formValues.capacity = Number(formValues.capacity);
    try {
      await createTable(formValues, abortController.signal);
      history.push("/dashboard");
    } catch (error) {
      setErrors(error);
    }
  }

  return (
    <div>
      <h1 className="mb-3">Create Table</h1>
      <form onSubmit={submitHandler} className="mb-4">
        <div className="col-6 form-group">
          <div className="row mb-2">
            <label>Table Name</label>
            <input
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
              className="form-control"
              name="capacity"
              type="number"
              min={1}
              required={true}
              placeholder="#"
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
      </form>
    </div>
  );
}
