import React from "react";
import { deleteTableRes } from "../utils/api";
import { useParams } from "react-router";

export default function Table({ table }) {
  const { table_id } = useParams();

  async function handleFinishTable() {
    try {
      await deleteTableRes(table_id);
    } catch (error) {
      console.log(error);
    }
  }

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
    </div>
  );
}
