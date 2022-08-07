import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function ReservationSeats() {
  const [tables, setTables] = useState([]);
  const [selectOptions, setSelectOptions] = useState("");
  const [errors, setErrors] = useState(null);
  const { reservation_id } = useParams();
  const history = useHistory();

  useEffect(() => {
    const abortController = new AbortController();
    setErrors(null);
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
    setSelectOptions({ [target.name]: target.value });
  }

  function submitHandler(event) {
    event.preventDefault();
    const abortController = new AbortController();
    updateTable(
      reservation_id,
      Number(selectOptions.table_id),
      abortController.signal
    )
      .then(() => history.push("/"))
      .catch(setErrors);

    return () => abortController.abort();
  }

  return (
    <div>
      <h4>Seat Reservation:{reservation_id}</h4>
      <form onSubmit={submitHandler}>
        <div>
          <select className="custom-select" onChange={changeHandler}>
            <option selected>Select a table </option>
            {tables.map((table) => (
              <option value={table.table_id} key={table.table_id}>
                {table.table_name} - {table.capacity}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary btn-sm" type="submit">
          Submit
        </button>
        <button className="btn btn-warning btn-sm">Cancel</button>
      </form>
      <ErrorAlert errors={errors} />
    </div>
  );
}
