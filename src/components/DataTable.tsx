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
    return <div className="p-4 text-sm text-slate-600">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-amber-100 bg-[#fffaf6] h-[340px]">
      <table className="w-full table-auto text-sm">
        <thead>
          <tr className="bg-[#fff3e6] text-slate-800">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-4 py-3 ${
                  column.align === "right" ? "text-right" : "text-left"
                } ${column.sortable ? "cursor-pointer" : ""}`}
                onClick={() => column.sortable && onSort?.(column.key)}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr
              key={index}
              className="border-t border-amber-50 even:bg-[#fff7f0]"
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className={`px-4 py-3 ${
                    column.align === "right" ? "text-right" : ""
                  }`}
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
  );
}
