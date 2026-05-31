import React from "react";

export interface Column<T> {
  key: keyof T;
  title: string;
  sortable?: boolean;
  align?: "left" | "right";
  render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  onSort?: (field: keyof T) => void;
  emptyMessage?: string;
}

export function DataTable<T>({
  rows,
  columns,
  onSort,
  emptyMessage = "No data found",
}: DataTableProps<T>) {
  if (!rows.length) {
    return (
      <div className="table-wrapper p-4 text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <div className="table-body overflow-auto">
        <table className="employee-table min-w-[720px] w-full table-fixed text-sm sm:text-base">
          <thead className="employee-row--header">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`${column.align === "right" ? "text-right" : "text-left"} ${column.sortable ? "cursor-pointer" : ""} whitespace-nowrap font-semibold text-[0.75rem] sm:text-sm`}
                  onClick={() => column.sortable && onSort?.(column.key)}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-[#0f9f8e14]">
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`${column.align === "right" ? "text-right" : "text-left"} text-slate-700`}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : String(row[column.key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
