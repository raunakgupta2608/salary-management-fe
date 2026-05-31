import apiClient from "../../api/axiosClient";
import { useAnalyticsData } from "../../hooks/useAnalyticsData";
import { formatCurrency } from "../../utils/currency";
import { DataTable, type Column } from "../../components/DataTable";

type CountrySummary = {
  country: string;
  min_salary: string;
  max_salary: string;
  avg_salary: string;
  employee_count: number;
  updated_at: string;
};

const columns: Column<CountrySummary>[] = [
  {
    key: "country",
    title: "Country",
    sortable: true,
  },
  {
    key: "min_salary",
    title: "Min",
    sortable: true,
    align: "right",
    render: (value) => formatCurrency(value),
  },
  {
    key: "max_salary",
    title: "Max",
    sortable: true,
    align: "right",
    render: (value) => formatCurrency(value),
  },
  {
    key: "avg_salary",
    title: "Avg",
    sortable: true,
    align: "right",
    render: (value) => formatCurrency(value),
  },
  {
    key: "employee_count",
    title: "Employees",
    sortable: true,
    align: "right",
  },
  {
    key: "updated_at",
    title: "Updated",
    sortable: true,
    align: "right",
    render: (_, row) => new Date(row.updated_at).toLocaleString(),
  },
];

const CountrySalarySummary = () => {
  const { rows, loading, error, filter, setFilter, toggleSort } =
    useAnalyticsData<CountrySummary>({
      fetcher: async () => {
        const res = await apiClient.get<CountrySummary[]>(
          "/analytics/country-salary-summary",
        );

        return Array.isArray(res.data) ? res.data : [];
      },

      defaultSortField: "avg_salary",

      numericFields: [
        "min_salary",
        "max_salary",
        "avg_salary",
        "employee_count",
      ],

      dateFields: ["updated_at"],

      filterFn: (row, search) => row.country.toLowerCase().includes(search),
    });

  if (loading)
    return (
      <section className="employee-table-shell">
        <div className="employee-table-summary">Loading...</div>
      </section>
    );

  if (error)
    return (
      <section className="employee-table-shell">
        <p className="error-message">{error}</p>
      </section>
    );

  return (
    <section className="employee-table-shell">
      <div className="employee-table-controls">
        <label>
          Search:
          <input
            aria-label="Filter countries"
            type="search"
            placeholder="Filter country"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </label>
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        onSort={toggleSort}
        emptyMessage="No countries matched."
      />

      <div className="employee-table-summary">
        Showing {rows.length} countr{rows.length === 1 ? "y" : "ies"}.
      </div>
    </section>
  );
};

export default CountrySalarySummary;
