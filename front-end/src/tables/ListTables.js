import React from "react";
import Table from "./Table";

export default function ListTables({ tables }) {
  return (
    <div className="table table-responsive-sm">
      <table className="table">
        {tables.map((table) => (
          <Table table={table} key={table.table_id} />
        ))}
      </table>
    </div>
  );
}
