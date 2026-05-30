import { useEffect, useMemo, useState } from "react";
import apiClient from "../../api/axiosClient";

type CountrySummary = {
  country: string;
  min_salary: string;
  max_salary: string;
  avg_salary: string;
  employee_count: number;
  updated_at: string;
};

const currency = new Intl.NumberFormat(undefined, {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatNumber = (val?: string | number) => {
  const n = Number(val || 0);
  if (Number.isNaN(n)) return "—";
  return currency.format(n);
};

const CountrySalarySummary = () => {
  const [rows, setRows] = useState<CountrySummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState<keyof CountrySummary | null>(
    "avg_salary",
  );
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    apiClient
      .get<CountrySummary[]>("/analytics/country-salary-summary")
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

  const normalizedFilter = filter.trim().toLowerCase();

  const visible = useMemo(() => {
    let list = rows;
    if (normalizedFilter) {
      list = list.filter((r) =>
        r.country.toLowerCase().includes(normalizedFilter),
      );
    }

    if (sortField) {
      list = [...list].sort((a, b) => {
        const av = a[sortField];
        const bv = b[sortField];

        // numeric compare for salary/count fields
        const na =
          typeof av === "string" && /salary/.test(sortField)
            ? Number(av)
            : typeof av === "string"
              ? av.localeCompare(String(bv))
              : (av as any) - (bv as any);
        const nb =
          typeof bv === "string" && /salary/.test(sortField)
            ? Number(bv)
            : typeof bv === "string"
              ? String(bv).localeCompare(String(av))
              : (bv as any) - (av as any);

        // if we computed numbers above, compare accordingly
        if (typeof na === "number" && typeof nb === "number") {
          return sortAsc ? na - nb : nb - na;
        }

        // fallback string compare
        return sortAsc
          ? String(av).localeCompare(String(bv))
          : String(bv).localeCompare(String(av));
      });
    }

    return list;
  }, [rows, normalizedFilter, sortField, sortAsc]);

  const toggleSort = (field: keyof CountrySummary) => {
    if (sortField === field) {
      setSortAsc((s) => !s);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  if (loading)
    return <div className="p-4 text-sm text-slate-600">Loading...</div>;
  if (error) return <div className="p-4 text-sm text-red-600">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-medium text-slate-900">
          Salary Summary by Country
        </h3>
        <div className="flex items-center gap-2">
          <input
            aria-label="Filter countries"
            placeholder="Filter country"
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
              <th className="px-4 py-3 text-left">Country</th>
              <th
                className="px-4 py-3 text-right cursor-pointer"
                onClick={() => toggleSort("min_salary")}
              >
                Min
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer"
                onClick={() => toggleSort("max_salary")}
              >
                Max
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer"
                onClick={() => toggleSort("avg_salary")}
              >
                Avg
              </th>
              <th
                className="px-4 py-3 text-right cursor-pointer"
                onClick={() => toggleSort("employee_count")}
              >
                Employees
              </th>
              <th className="px-4 py-3 text-right">Updated</th>
            </tr>
          </thead>

          <tbody>
            {visible.map((r) => (
              <tr
                key={r.country}
                className="border-t border-amber-50 even:bg-[#fff7f0]"
              >
                <td className="px-4 py-3">{r.country}</td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(r.min_salary)}
                </td>
                <td className="px-4 py-3 text-right">
                  {formatNumber(r.max_salary)}
                </td>
                <td className="px-4 py-3 text-right font-medium">
                  {formatNumber(r.avg_salary)}
                </td>
                <td className="px-4 py-3 text-right">{r.employee_count}</td>
                <td className="px-4 py-3 text-right">
                  {new Date(r.updated_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible.length === 0 && (
        <div className="p-4 text-sm text-slate-600">No countries matched.</div>
      )}
    </div>
  );
};

export default CountrySalarySummary;
