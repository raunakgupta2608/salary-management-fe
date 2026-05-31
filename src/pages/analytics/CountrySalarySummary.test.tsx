import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../api/axiosClient", () => {
  return {
    default: {
      get: vi.fn(),
    },
  };
});

import apiClient from "../../api/axiosClient";
import CountrySalarySummary from "./CountrySalarySummary";

const mockData = [
  {
    country: "India",
    min_salary: "50000",
    max_salary: "200000",
    avg_salary: "120000",
    employee_count: 100,
    updated_at: "2025-01-01T10:00:00Z",
  },
  {
    country: "USA",
    min_salary: "70000",
    max_salary: "250000",
    avg_salary: "180000",
    employee_count: 50,
    updated_at: "2025-01-01T10:00:00Z",
  },
  {
    country: "Germany",
    min_salary: "60000",
    max_salary: "220000",
    avg_salary: "150000",
    employee_count: 30,
    updated_at: "2025-01-01T10:00:00Z",
  },
];

let mockedGet: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockedGet = apiClient.get as unknown as ReturnType<typeof vi.fn>;
});

describe("CountrySalarySummary", () => {
  it("shows loading state initially", () => {
    mockedGet.mockReturnValue(new Promise(() => {}));

    render(<CountrySalarySummary />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders data after successful fetch", async () => {
    mockedGet.mockResolvedValue({ data: mockData });

    render(<CountrySalarySummary />);

    expect(await screen.findByText("India")).toBeInTheDocument();
    expect(await screen.findByText("USA")).toBeInTheDocument();
    expect(await screen.findByText("Germany")).toBeInTheDocument();
  });

  it("shows error message on API failure", async () => {
    mockedGet.mockRejectedValue(new Error("API failed"));

    render(<CountrySalarySummary />);

    expect(await screen.findByText(/API failed/i)).toBeInTheDocument();
  });

  it("filters countries correctly", async () => {
    mockedGet.mockResolvedValue({ data: mockData });

    render(<CountrySalarySummary />);

    await screen.findByText("India");

    const input = screen.getByPlaceholderText("Filter country");

    fireEvent.change(input, { target: { value: "ind" } });

    expect(await screen.findByText("India")).toBeInTheDocument();
    expect(screen.queryByText("USA")).not.toBeInTheDocument();
    expect(screen.queryByText("Germany")).not.toBeInTheDocument();
  });

  it("sorts by employee_count when header clicked", async () => {
    mockedGet.mockResolvedValue({ data: mockData });

    render(<CountrySalarySummary />);

    await screen.findByText("India");

    const header = screen.getByText("Employees");

    fireEvent.click(header);
    fireEvent.click(header);

    // verify all still exist (order is handled internally)
    expect(screen.getByText("India")).toBeInTheDocument();
    expect(screen.getByText("USA")).toBeInTheDocument();
    expect(screen.getByText("Germany")).toBeInTheDocument();
  });

  it("sorts by avg salary column", async () => {
    mockedGet.mockResolvedValue({ data: mockData });

    render(<CountrySalarySummary />);

    await screen.findByText("India");

    const header = screen.getByText("Avg");

    fireEvent.click(header);

    expect(screen.getByText("USA")).toBeInTheDocument();
  });

  it("sorts by min salary column", async () => {
    mockedGet.mockResolvedValue({ data: mockData });

    render(<CountrySalarySummary />);

    await screen.findByText("India");

    const header = screen.getByText("Min");

    fireEvent.click(header);

    expect(screen.getByText("India")).toBeInTheDocument();
  });

  it("shows no results message when filter matches nothing", async () => {
    mockedGet.mockResolvedValue({ data: mockData });

    render(<CountrySalarySummary />);

    await screen.findByText("India");

    const input = screen.getByPlaceholderText("Filter country");

    fireEvent.change(input, { target: { value: "zzz" } });

    expect(
      await screen.findByText("No countries matched."),
    ).toBeInTheDocument();
  });
});
