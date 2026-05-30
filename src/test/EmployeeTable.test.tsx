import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockedDispatch = vi.fn();

vi.mock("react-redux", () => {
  return {
    useDispatch: () => mockedDispatch,
    useSelector: (selector: any) => selector(mockStore),
  };
});

vi.mock("../store/employeesSlice", () => ({
  fetchEmployeesPage: vi.fn(() => ({ type: "employees/fetchEmployeesPage" })),
}));

vi.mock("react-window", () => {
  return {
    List: ({ rowCount, rowComponent: Row, onRowsRendered }: any) => {
      return (
        <div>
          {Array.from({ length: rowCount }).map((_, index) => (
            <Row key={index} index={index} style={{}} />
          ))}

          {/* trigger infinite scroll manually */}
          <button
            onClick={() =>
              onRowsRendered({
                overscanStartIndex: 0,
                overscanStopIndex: rowCount - 1,
                startIndex: 0,
                stopIndex: rowCount - 1,
              })
            }
          >
            trigger
          </button>
        </div>
      );
    },
  };
});

import EmployeeTable from "../pages/EmployeeTable";
import { fetchEmployeesPage } from "../store/employeesSlice";

const mockEmployees = [
  {
    id: 1,
    full_name: "Alice Johnson",
    job_title: "Engineer",
    country: "India",
    salary: "100000",
    department: "Tech",
    email: "alice@test.com",
    employment_status: "Active",
    created_at: "",
    updated_at: "",
  },
  {
    id: 2,
    full_name: "Bob Smith",
    job_title: "Manager",
    country: "USA",
    salary: "200000",
    department: "HR",
    email: "bob@test.com",
    employment_status: "Active",
    created_at: "",
    updated_at: "",
  },
];

let mockStore: any;

beforeEach(() => {
  vi.clearAllMocks();

  mockStore = {
    employees: {
      employees: [],
      nextCursor: null,
      hasMore: true,
      loading: false,
      error: "",
    },
  };
});

describe("EmployeeTable", () => {
  it("dispatches initial fetch when employees are empty", () => {
    render(<EmployeeTable />);

    expect(mockedDispatch).toHaveBeenCalledWith(
      fetchEmployeesPage({ cursor: null, limit: 20 }),
    );
  });

  it("renders employees correctly", () => {
    mockStore.employees.employees = mockEmployees;

    render(<EmployeeTable />);

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.getByText("Engineer")).toBeInTheDocument();
  });

  it("filters employees by search input", () => {
    mockStore.employees.employees = mockEmployees;

    render(<EmployeeTable />);

    const input = screen.getByPlaceholderText(
      /name, job, country, department, email/i,
    );

    fireEvent.change(input, { target: { value: "india" } });

    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.queryByText("Bob Smith")).not.toBeInTheDocument();
  });

  it("shows error message when API fails", () => {
    mockStore.employees.error = "API failed";

    render(<EmployeeTable />);

    expect(screen.getByText("API failed")).toBeInTheDocument();
  });

  it("shows correct employee count summary", () => {
    mockStore.employees.employees = mockEmployees;

    render(<EmployeeTable />);

    expect(screen.getByText(/Showing 2 employees/)).toBeInTheDocument();
  });

  it("shows singular summary when one employee", () => {
    mockStore.employees.employees = [mockEmployees[0]];

    render(<EmployeeTable />);

    expect(screen.getByText(/Showing 1 employee/)).toBeInTheDocument();
  });

  it("triggers loadMore when scrolling near end", () => {
    mockStore.employees.employees = mockEmployees;
    mockStore.employees.hasMore = true;

    render(<EmployeeTable />);

    fireEvent.click(screen.getByText("trigger"));

    expect(mockedDispatch).toHaveBeenCalled();
  });

  it("shows no more employees message when hasMore is false", () => {
    mockStore.employees.employees = mockEmployees;
    mockStore.employees.hasMore = false;

    render(<EmployeeTable />);

    expect(screen.getByText("No more employees to load.")).toBeInTheDocument();
  });
});
