import React from "react";

export default function ReservationSeats({ isShown, tables }) {
  return (
    <div>
      <div className="modal" tabindex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Choose a Table</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div>
                <form>
                  <label htmlFor="table_id">
                    Choose a Table
                    <select
                      className="form-select"
                      size="3"
                      aria-label="size 3 select example"
                    >
                      <option selected>Select an Option</option>
                      {tables.map((table) => (
                        <option key={table.table_id} value={table.table_id}>
                          {table.table_name} - {table.capacity}
                        </option>
                      ))}
                    </select>
                  </label>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button type="button" className="btn btn-primary">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
