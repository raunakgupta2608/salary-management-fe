import { DataTable, type Column } from "../../components/DataTable";
import { useAnalyticsData } from "../../hooks/useAnalyticsData";

type AnalyticsTableViewProps<T, K extends keyof T = keyof T> = {
  fetcher: () => Promise<T[]>;
  columns: Column<T>[];

  defaultSortField: K;
  numericFields?: K[];
  dateFields?: K[];

  filterPlaceholder: string;
  filterFn: (row: T, search: string) => boolean;
  emptyMessage: string;
  summaryText: (count: number) => string;
  searchAriaLabel?: string;
};

export function AnalyticsTableView<T, K extends keyof T = keyof T>({
  fetcher,
  columns,
  defaultSortField,
  numericFields,
  dateFields,
  filterPlaceholder,
  filterFn,
  emptyMessage,
  summaryText,
  searchAriaLabel,
}: AnalyticsTableViewProps<T, K>) {
  const { rows, loading, error, filter, setFilter, toggleSort } =
    useAnalyticsData<T>({
      fetcher,
      defaultSortField,
      numericFields,
      dateFields,
      filterFn,
    });

  if (loading) {
    return (
      <section className="employee-table-shell">
        <div className="employee-table-summary">Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="employee-table-shell">
        <p className="error-message">{error}</p>
      </section>
    );
  }

  return (
    <section className="employee-table-shell">
      <div className="employee-table-controls">
        <label>
          Search:
          <input
            aria-label={searchAriaLabel}
            type="search"
            placeholder={filterPlaceholder}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </label>
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        onSort={toggleSort}
        emptyMessage={emptyMessage}
      />

      <div className="employee-table-summary">{summaryText(rows.length)}</div>
    </section>
  );
}
