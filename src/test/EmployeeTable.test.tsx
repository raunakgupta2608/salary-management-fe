import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import apiClient from "../api/axiosClient";
import EmployeeTable from "../components/EmployeeTable";

vi.mock("react-window", () => ({
  List: ({
    rowCount,
    rowComponent: Row,
    onRowsRendered,
  }: {
    rowCount: number;
    rowComponent: any;
    onRowsRendered?: (props: { stopIndex: number }) => void;
  }) => {
    onRowsRendered?.({ stopIndex: rowCount - 1 });

    return (
      <div data-testid="mock-list">
        {Array.from({ length: rowCount }).map((_, index) => (
          <Row key={index} index={index} style={{}} />
        ))}
      </div>
    );
  },
}));

vi.mock("../api/axiosClient", () => ({
  default: {
    get: vi.fn(),
  },
}));

const mockedGet = vi.mocked(apiClient.get);

const mockEmployees = [
  {
    id: 1,
    full_name: "John Doe",
    job_title: "Software Engineer",
    country: "USA",
    salary: "100000",
    department: "Engineering",
    email: "john@example.com",
    employment_status: "Active",
    created_at: "",
    updated_at: "",
  },
  {
    id: 2,
    full_name: "Jane Smith",
    job_title: "Product Manager",
    country: "India",
    salary: "120000",
    department: "Product",
    email: "jane@example.com",
    employment_status: "Inactive",
    created_at: "",
    updated_at: "",
  },
];

describe("EmployeeTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders employees after API call", async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        data: mockEmployees,
        nextCursor: null,
        hasMore: false,
      },
    });

    render(<EmployeeTable />);

    expect(mockedGet).toHaveBeenCalledWith("/employee", {
      params: {
        cursor: undefined,
        limit: 20,
      },
    });

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });
  });

  it("filters employees based on search input", async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        data: mockEmployees,
        nextCursor: null,
        hasMore: false,
      },
    });

    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      "Name, job, country, department, email",
    );

    fireEvent.change(searchInput, {
      target: { value: "Jane" },
    });

    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("shows error message when API fails", async () => {
    mockedGet.mockRejectedValue(new Error("Network Error"));

    render(<EmployeeTable />);

    expect(await screen.findByText("Network Error")).toBeInTheDocument();
  });

  it("loads more employees when scrolling reaches threshold", async () => {
    mockedGet
      .mockResolvedValueOnce({
        data: {
          data: [mockEmployees[0]],
          nextCursor: 2,
          hasMore: true,
        },
      })
      .mockResolvedValueOnce({
        data: {
          data: [mockEmployees[1]],
          nextCursor: null,
          hasMore: false,
        },
      });

    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    });

    expect(mockedGet).toHaveBeenCalledTimes(2);
  });

  it("shows no more employees message", async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        data: mockEmployees,
        nextCursor: null,
        hasMore: false,
      },
    });

    render(<EmployeeTable />);

    await waitFor(() => {
      expect(
        screen.getByText("No more employees to load."),
      ).toBeInTheDocument();
    });
  });

  it("shows correct employee count", async () => {
    mockedGet.mockResolvedValueOnce({
      data: {
        data: mockEmployees,
        nextCursor: null,
        hasMore: false,
      },
    });

    render(<EmployeeTable />);

    await waitFor(() => {
      expect(screen.getByText("Showing 2 employees.")).toBeInTheDocument();
    });
  });
});
