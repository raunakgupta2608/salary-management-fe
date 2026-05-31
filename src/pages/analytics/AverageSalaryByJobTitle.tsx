import apiClient from "../../api/axiosClient";
import { useAnalyticsData } from "../../hooks/useAnalyticsData";
import { formatCurrency } from "../../utils/currency";
import { DataTable, type Column } from "../../components/DataTable";

type JobTitleSalary = {
  job_title: string;
  avg_salary: string;
  employee_count: number;
};

const columns: Column<JobTitleSalary>[] = [
  {
    key: "job_title",
    title: "Job Title",
    sortable: true,
  },
  {
    key: "avg_salary",
    title: "Avg Salary",
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
];

const AverageSalaryByJobTitle = () => {
  const { rows, loading, error, filter, setFilter, toggleSort } =
    useAnalyticsData<JobTitleSalary>({
      fetcher: async () => {
        const res = await apiClient.get<JobTitleSalary[]>(
          "/analytics/job-title-salary",
        );

        return Array.isArray(res.data) ? res.data : [];
      },

      defaultSortField: "avg_salary",

      numericFields: ["avg_salary", "employee_count"],

      filterFn: (row, search) => row.job_title.toLowerCase().includes(search),
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
            type="search"
            placeholder="Filter job titles"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </label>
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        onSort={toggleSort}
        emptyMessage="No job titles found."
      />

      <div className="employee-table-summary">
        Showing {rows.length} job title{rows.length === 1 ? "" : "s"}.
      </div>
    </section>
  );
};

export default AverageSalaryByJobTitle;
