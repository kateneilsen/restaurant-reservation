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
      <div className="container">
        <div className="row">
          <div className="col">
            <p>Table: {table.table_name}</p>
            <p>Capacity: {table.capacity}</p>
          </div>
          <div className="col" data-table-id-status={table.table_id}>
            {table.reservation_id ? "Occupied" : "Free"}
          </div>
          <div className="col">
            {table.reservation_id === null ? (
              ""
            ) : (
              <button
                className="btn btn-primary btn-sm"
                data-table-id-finish={table.table_id}
                onClick={() => handleFinishTable(table.table_id)}
              >
                Finish
              </button>
            )}
          </div>
        </div>
      </div>
      <ErrorAlert error={error} />
    </>
  );
}
