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
    return <div className="p-4 text-sm text-slate-600">Loading...</div>;

  if (error) return <div className="p-4 text-sm text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-medium text-slate-900">
          Salary Summary by Country
        </h3>

        <input
          aria-label="Filter countries"
          placeholder="Filter country"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm"
        />
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        onSort={toggleSort}
        emptyMessage="No countries matched."
      />
    </div>
  );
};

export default CountrySalarySummary;
