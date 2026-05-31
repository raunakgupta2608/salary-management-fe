import apiClient from "../../api/axiosClient";
import { formatCurrency } from "../../utils/currency";

import type { Column } from "../../components/DataTable";
import { AnalyticsTableView } from "./AnalyticsTableView";

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

export default function AverageSalaryByJobTitle() {
  return (
    <AnalyticsTableView<JobTitleSalary>
      fetcher={async () => {
        const res = await apiClient.get<JobTitleSalary[]>(
          "/analytics/job-title-salary",
        );

        return Array.isArray(res.data) ? res.data : [];
      }}
      columns={columns}
      defaultSortField="avg_salary"
      numericFields={["avg_salary", "employee_count"]}
      filterPlaceholder="Filter job titles"
      filterFn={(row, search) => row.job_title.toLowerCase().includes(search)}
      emptyMessage="No job titles found."
      summaryText={(count) =>
        `Showing ${count} job title${count === 1 ? "" : "s"}.`
      }
    />
  );
}
