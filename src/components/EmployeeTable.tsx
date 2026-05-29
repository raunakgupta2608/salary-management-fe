import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { List, type RowComponentProps } from "react-window";
import apiClient from "../api/axiosClient";

export type Employee = {
  id: number;
  full_name: string;
  job_title: string;
  country: string;
  salary: string;
  department: string;
  email: string;
  employment_status: string;
  created_at: string;
  updated_at: string;
};

const ROW_HEIGHT = 52;
const LIST_HEIGHT = 560;

function EmployeeTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await apiClient.get("/");

      const payload = response.data;
      const data = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

      setEmployees(data);
    } catch (err) {
      console.error("API Error:", err);
      setError((err as Error)?.message ?? "Unable to load employee data.");
    } finally {
      setLoading(false);
    }
  };

  const normalizedFilter = filter.trim().toLowerCase();

  const filteredEmployees = useMemo(() => {
    if (!normalizedFilter) {
      return employees;
    }

    return employees.filter((employee) =>
      [
        employee.full_name,
        employee.job_title,
        employee.country,
        employee.department,
        employee.email,
        employee.employment_status,
      ].some((field) => field.toLowerCase().includes(normalizedFilter)),
    );
  }, [employees, normalizedFilter]);

  const handleFilterChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFilter(event.target.value);
  };

  const Row = ({ index, style }: RowComponentProps<{}>) => {
    const employee = filteredEmployees[index];
    return (
      <div className="employee-row" style={style} role="row">
        <div className="employee-cell employee-cell--name">
          {employee.full_name}
        </div>
        <div className="employee-cell employee-cell--job">
          {employee.job_title}
        </div>
        <div className="employee-cell employee-cell--department">
          {employee.department}
        </div>
        <div className="employee-cell employee-cell--country">
          {employee.country}
        </div>
        <div className="employee-cell employee-cell--email">
          {employee.email}
        </div>
        <div className="employee-cell employee-cell--status">
          {employee.employment_status}
        </div>
        <div className="employee-cell employee-cell--salary">
          {employee.salary}
        </div>
      </div>
    );
  };

  return (
    <section className="employee-table-shell">
      <div className="employee-table-controls">
        <label>
          Search:
          <input
            type="search"
            value={filter}
            onChange={handleFilterChange}
            placeholder="Name, job, country, department, email"
          />
        </label>
      </div>

      {loading && <p>Loading employee data…</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && (
        <>
          <div
            className="table-wrapper"
            role="table"
            aria-label="Employee table"
          >
            <div className="employee-row employee-row--header" role="rowgroup">
              <div className="employee-cell employee-cell--name">Name</div>
              <div className="employee-cell employee-cell--job">Job Title</div>
              <div className="employee-cell employee-cell--department">
                Department
              </div>
              <div className="employee-cell employee-cell--country">
                Country
              </div>
              <div className="employee-cell employee-cell--email">Email</div>
              <div className="employee-cell employee-cell--status">Status</div>
              <div className="employee-cell employee-cell--salary">Salary</div>
            </div>

            <div className="employee-list-container">
              <List
                className="employee-list"
                defaultHeight={LIST_HEIGHT}
                rowCount={filteredEmployees.length}
                rowHeight={ROW_HEIGHT}
                rowComponent={Row}
                rowProps={{}}
              />
            </div>
          </div>

          <div className="employee-table-summary">
            Showing {filteredEmployees.length} employee
            {filteredEmployees.length === 1 ? "" : "s"}.
          </div>
        </>
      )}
    </section>
  );
}

export default EmployeeTable;
