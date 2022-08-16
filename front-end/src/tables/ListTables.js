import React from "react";
import Table from "./Table";

export default function ListTables({ tables }) {
  return (
    <ul className="list-group">
      {tables.map((table) => (
        <Table table={table} key={table.table_id} />
      ))}
    </ul>
  );
}
