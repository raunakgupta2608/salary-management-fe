import apiClient from "../../api/axiosClient";
import { formatCurrency } from "../../utils/currency";
import type { Column } from "../../components/DataTable";
import { AnalyticsTableView } from "./AnalyticsTableView";

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

export default function CountrySalarySummary() {
  return (
    <AnalyticsTableView<CountrySummary>
      fetcher={async () => {
        const res = await apiClient.get<CountrySummary[]>(
          "/analytics/country-salary-summary",
        );

        return Array.isArray(res.data) ? res.data : [];
      }}
      columns={columns}
      defaultSortField="avg_salary"
      numericFields={[
        "min_salary",
        "max_salary",
        "avg_salary",
        "employee_count",
      ]}
      dateFields={["updated_at"]}
      filterPlaceholder="Filter country"
      searchAriaLabel="Filter countries"
      filterFn={(row, search) => row.country.toLowerCase().includes(search)}
      emptyMessage="No countries matched."
      summaryText={(count) =>
        `Showing ${count} countr${count === 1 ? "y" : "ies"}.`
      }
    />
  );
}
