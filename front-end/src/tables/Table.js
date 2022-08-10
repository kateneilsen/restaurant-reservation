import React, { useState } from "react";
import { deleteTableRes } from "../utils/api";
import { useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";

export default function Table({ table }) {
  const [error, setError] = useState(false);

  const handleFinishTable = async () => {
    const abortController = new AbortController();
    try {
      await deleteTableRes(table.table_id, abortController.signal);
    } catch (error) {
      setError(error);
    }
    return () => abortController.abort();
  };

  return (
    <div key={table.table_id} className="card p-4">
      <div className="row">
        <div className="col">
          <div className="row">Table Name: {table.table_name}</div>
          <div className="row">Capacity: {table.capacity}</div>
        </div>
        <div className="col">
          <div className="row" data-table-id-status={table.table_id}>
            {table.reservation_id ? (
              <button
                className="btn btn-primary btn-sm"
                data-table-id-finish={table.table_id}
                onClick={() =>
                  window.confirm(
                    "Is this table ready to seat new guests? This cannot be undone."
                      ? handleFinishTable()
                      : console.log("You clicked cancel.")
                  )
                }
              >
                Finish
              </button>
            ) : (
              "Free"
            )}
          </div>
        </div>
      </div>
      <ErrorAlert error={error} />
    </div>
  );
}
