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
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="max-h-[420px] overflow-y-auto">
        <table className="min-w-[720px] w-full table-fixed text-sm sm:text-base">
          <thead className="sticky top-0 z-10 bg-[#e8f1f6] text-slate-700">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-4 py-3 ${
                    column.align === "right" ? "text-right" : "text-left"
                  } ${column.sortable ? "cursor-pointer" : ""} whitespace-nowrap font-semibold uppercase text-[0.75rem] sm:text-sm`}
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
                className="border-t border-slate-100 even:bg-slate-50/80 hover:bg-emerald-50/60"
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={`px-4 py-3 ${
                      column.align === "right" ? "text-right" : "text-left"
                    } break-words whitespace-normal text-slate-700`}
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
