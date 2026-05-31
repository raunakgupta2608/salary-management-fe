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
    return <div className="p-4 text-sm text-slate-500">Loading...</div>;

  if (error) return <div className="p-4 text-sm text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          Avg salary by job title
        </h3>

        <input
          placeholder="Filter job titles"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-inner shadow-slate-200/60 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 sm:w-52"
        />
      </div>

      <DataTable
        rows={rows}
        columns={columns}
        onSort={toggleSort}
        emptyMessage="No job titles found"
      />

      <div className="text-sm text-slate-500">
        Showing {rows.length} job titles
      </div>
    </div>
  );
};

export default AverageSalaryByJobTitle;
