import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function ReservationSeats() {
  const [options, setOptions] = useState("");
  const [errors, setErrors] = useState([]);
  const [tables, setTables] = useState([]);

  const { reservationId } = useParams();
  const history = useHistory();

  useEffect(() => {
    const abortController = new AbortController();
    setErrors([]);
    async function loadTables() {
      try {
        const response = await listTables(abortController.signal);
        setTables(response);
      } catch (error) {
        setErrors(error);
      }
    }
    loadTables();
    return () => abortController.abort();
  }, []);

  function changeHandler({ target }) {
    setOptions({ [target.name]: target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await updateTable(
        reservationId,
        Number(options.table_id),
        abortController.signal
      );
      history.push("/dashboard");
    } catch (error) {
      setErrors(error);
    }
    return () => abortController.abort();
  }

  console.log(reservationId);

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <h4>Reservation #{reservationId}</h4>
          {tables && (
            <div className="form-group">
              <select
                name="table_id"
                onChange={changeHandler}
                className="form-control"
              >
                <option>Select a Table</option>
                {tables.map((table) => (
                  <option value={table.table_id} key={table.table_id}>
                    {table.table_name} - {table.capacity}
                  </option>
                ))}
              </select>
            </div>
          )}
          <button className="btn btn-primary btn-sm m-2" type="submit">
            Submit
          </button>
          <button
            className="btn btn-danger btn-sm m-2"
            onClick={() => history.goBack()}
          >
            Cancel
          </button>
        </form>
      </div>
      <ErrorAlert errors={errors} />
    </div>
  );
}
