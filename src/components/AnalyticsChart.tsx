import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { RootState } from "../store";
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

  // Aggregate total salary by department
  const totalsByDept = employees.reduce<Record<string, number>>((acc, emp) => {
    const dept = emp.department || "Unknown";
    const salary = Number(emp.salary) || 0;
    acc[dept] = (acc[dept] || 0) + salary;
    return acc;
  }, {});

  const labels = Object.keys(totalsByDept);
  const values = labels.map((l) => Math.round(totalsByDept[l]));

  const colors = [
    "#C68642",
    "#E3B778",
    "#D9A66A",
    "#B5895E",
    "#F1D9C5",
    "#9C7A4C",
    "#F7EDE2",
  ];

  const data = {
    labels,
    datasets: [
      {
        label: "Total salary by department",
        data: values,
        backgroundColor: labels.map((_, i) => colors[i % colors.length]),
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      {loading && <p className="text-sm text-slate-500">Loading analytics…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && labels.length === 0 && (
        <p className="text-sm text-slate-500">
          No employee data available for analytics.
        </p>
      )}

      {!loading && !error && labels.length > 0 && (
        <div className="flex">
          <div className="w-1/2 px-[5%] rounded-xl border border-amber-100 bg-[#fffaf6] shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-800 text-center">
              Salary distribution by department
            </h3>
            <div className="mx-auto w-full max-w-[500px] h-[400px] flex justify-end">
              <Pie data={data} />
            </div>
          </div>

          <div className="w-1/2 px-[5%] rounded-xl border border-amber-100 bg-[#fffaf6] shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-slate-800">
              Summary
            </h3>
            <ul className="space-y-3">
              {labels.map((label, idx) => (
                <li key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="inline-block h-3 w-6 rounded"
                      style={{ background: colors[idx % colors.length] }}
                    />
                    <span className="text-sm text-slate-800">{label}</span>
                  </div>
                  <div className="text-sm font-medium text-slate-900">
                    {formatCurrency(values[idx])}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
