import React, { useState } from "react";
import { deleteTableRes } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router";

export default function Table({ table }) {
  const [error, setError] = useState(false);
  const history = useHistory();

  const handleFinishTable = async (table_id) => {
    const abortController = new AbortController();
    try {
      if (
        window.confirm(
          "Is this table ready to seat new guests? \n\n This cannot be undone."
        )
      ) {
        await deleteTableRes(table_id, abortController.signal);
        history.go();
      }
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  };

  return (
    <>
      <li className="list-group-item">
        <div className="row">
          <div className="col">
            <p>
              <u>Table:</u> {table.table_name}
            </p>
            <p>
              <u>Capacity:</u> {table.capacity}
            </p>
          </div>
          <div className="col">
            <p data-table-id-status={table.table_id} className="row">
              {table.reservation_id ? "Occupied" : "Free"}
            </p>
            <div className="row">
              {table.reservation_id === null ? (
                ""
              ) : (
                <button
                  className="btn btn-info btn-sm"
                  data-table-id-finish={table.table_id}
                  onClick={() => handleFinishTable(table.table_id)}
                >
                  Finish
                </button>
              )}
            </div>
          </div>
        </div>
      </li>
      <ErrorAlert error={error} />
    </>
  );
}
