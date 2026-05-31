import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { RootState } from "../store";
import type { Employee } from "../store/employeesSlice";
import { useSelector } from "react-redux";

ChartJS.register(ArcElement, Tooltip, Legend);

function formatCurrency(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export default function AnalyticsChart() {
  const { employees, loading, error } = useSelector(
    (s: RootState) => s.employees,
  );

  const totalsByDept = employees.reduce<Record<string, number>>(
    (acc, emp: Employee) => {
      const dept = emp.department || "Unknown";
      const salary = Number(emp.salary) || 0;
      acc[dept] = (acc[dept] || 0) + salary;
      return acc;
    },
    {},
  );

  const labels = Object.keys(totalsByDept);
  const values = labels.map((l) => Math.round(totalsByDept[l]));

  const colors = [
    "#0F9F8E",
    "#315CFD",
    "#F59E0B",
    "#7C3AED",
    "#22C55E",
    "#0EA5E9",
    "#F43F5E",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Total salary by department",
        data: values,
        backgroundColor: labels.map((_, i) => colors[i % colors.length]),
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <>
      {loading && (
        <p className="text-sm text-slate-500">Loading analytics...</p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && labels.length === 0 && (
        <p className="text-sm text-slate-500">
          No employee data available for analytics.
        </p>
      )}

      {!loading && !error && labels.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] employee-table-shell">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-center text-base font-semibold text-slate-900">
              Salary distribution by department
            </h3>
            <div className="mx-auto flex h-[360px] w-full max-w-[520px] items-center justify-center">
              <Pie data={data} />
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-base font-semibold text-slate-900 text-center">
              Summary
            </h3>
            <ul className="space-y-3">
              {labels.map((label, idx) => (
                <li
                  key={label}
                  className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-3 py-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span
                      className="inline-block h-3 w-6 shrink-0 rounded"
                      style={{ background: colors[idx % colors.length] }}
                    />
                    <span className="truncate text-sm text-slate-700">
                      {label}
                    </span>
                  </div>
                  <div className="shrink-0 text-sm font-semibold text-slate-900">
                    {formatCurrency(values[idx])}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
