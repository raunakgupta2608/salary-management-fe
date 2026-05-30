import { useEffect, useMemo, useState } from "react";
import apiClient from "../../api/axiosClient";

type JobTitleSalary = {
  job_title: string;
  avg_salary: string;
  employee_count: number;
};

const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatSalary = (v?: string | number) => {
  const n = Number(v || 0);
  if (Number.isNaN(n)) return "—";
  return currency.format(Math.round(n));
};

const AverageSalaryByJobTitle = () => {
  const [rows, setRows] = useState<JobTitleSalary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState<keyof JobTitleSalary | null>(
    "avg_salary",
  );
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiClient
      .get<JobTitleSalary[]>("/analytics/job-title-salary")
      .then((res) => {
        if (!mounted) return;
        const data = Array.isArray(res.data) ? res.data : [];
        setRows(data);
      })
      .catch((err) => {
        console.error(err);
        if (!mounted) return;
        setError((err as Error).message || "Unable to load data");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const normalized = filter.trim().toLowerCase();

  const processed = useMemo(() => {
    let list = rows;
    if (normalized) {
      list = list.filter((r) => r.job_title.toLowerCase().includes(normalized));
    }

    if (sortField) {
      list = [...list].sort((a, b) => {
        const av = a[sortField];
        const bv = b[sortField];

        if (sortField === "avg_salary") {
          return sortAsc ? Number(av) - Number(bv) : Number(bv) - Number(av);
        }

        if (sortField === "employee_count") {
          return sortAsc
            ? Number(av as number) - Number(bv as number)
            : Number(bv as number) - Number(av as number);
        }

        // string compare for job_title
        return sortAsc
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }

    return list;
  }, [rows, normalized, sortField, sortAsc]);

  const total = processed.length;
  const toggleSort = (field: keyof JobTitleSalary) => {
    if (sortField === field) setSortAsc((s) => !s);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  if (loading)
    return <div className="p-4 text-sm text-slate-600">Loading…</div>;
  if (error) return <div className="p-4 text-sm text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-slate-900">
          Avg salary by job title
        </h3>
        <div className="flex items-center gap-3">
          <input
            placeholder="Filter job titles"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-md border border-amber-200 bg-white px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-amber-100 bg-[#fffaf6] h-[340px]">
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-[#fff3e6] text-slate-800">
              <th
                className="px-4 py-3 text-left cursor-pointer"
                onClick={() => toggleSort("job_title")}
              >
                Job title
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer"
                onClick={() => toggleSort("avg_salary")}
              >
                Avg salary
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer"
                onClick={() => toggleSort("employee_count")}
              >
                Employees
              </th>
            </tr>
          </thead>

          <tbody>
            {processed.map((r, idx) => (
              <tr
                key={`${r.job_title}-${idx}`}
                className="border-t border-amber-50 even:bg-[#fff7f0]"
              >
                <td className="px-4 py-3">{r.job_title}</td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatSalary(r.avg_salary)}
                </td>
                <td className="px-4 py-3 text-right">{r.employee_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600">Showing {total} job titles</div>
      </div>
    </div>
  );
};

export default AverageSalaryByJobTitle;
