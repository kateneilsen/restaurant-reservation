import React from "react";
import Table from "./Table";

export default function ListTables({ tables }) {
  return (
    <div className="mt-4">
      <h4>Tables</h4>
      {tables.map((table) => (
        <Table table={table} key={table.table_id} />
      ))}
    </div>
  );
}
