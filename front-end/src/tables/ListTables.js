import React from "react";

export default function ListTables({ tables }) {
  // const tableList = tables.map((table) => (
  //   <div key={table.table_id} className="list-group">
  //     <div className="row">
  //       <div className="col">
  //         <div className="row">Table Name: {table.table_name}</div>
  //         <div className="row">Capacity: {table.capacity}</div>
  //       </div>
  //       <div className="col">
  //         <div className="row">Free</div>
  //         <div className="row">Occupied</div>
  //       </div>
  //     </div>
  //   </div>
  // ));
  return (
    <div className="mt-4">
      <h4>Tables</h4>
      {tables.map((table) => (
        <div key={table.table_id} className="card p-4">
          <div className="row">
            <div className="col">
              <div className="row">Table Name: {table.table_name}</div>
              <div className="row">Capacity: {table.capacity}</div>
            </div>
            <div className="col">
              <div className="row" data-table-id-status={table.table_id}>
                {table.reservation_id ? "Occupied" : "Free"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
