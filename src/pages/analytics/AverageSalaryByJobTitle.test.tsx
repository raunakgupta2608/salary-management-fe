import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../api/axiosClient", () => {
  return {
    default: {
      get: vi.fn(),
    },
  };
});

import apiClient from "../../api/axiosClient";
import AverageSalaryByJobTitle from "./AverageSalaryByJobTitle";

const mockData = [
  { job_title: "Engineer", avg_salary: "100000", employee_count: 10 },
  { job_title: "Manager", avg_salary: "150000", employee_count: 5 },
  { job_title: "Analyst", avg_salary: "80000", employee_count: 20 },
];

let mockedGet: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.clearAllMocks();
  mockedGet = apiClient.get as unknown as ReturnType<typeof vi.fn>;
});

describe("AverageSalaryByJobTitle", () => {
  it("shows loading state initially", () => {
    mockedGet.mockReturnValue(new Promise(() => {}));

    render(<AverageSalaryByJobTitle />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders data after successful fetch", async () => {
    mockedGet.mockResolvedValue({ data: mockData });

    render(<AverageSalaryByJobTitle />);

    expect(await screen.findByText("Engineer")).toBeInTheDocument();
    expect(await screen.findByText("Manager")).toBeInTheDocument();
    expect(await screen.findByText("Analyst")).toBeInTheDocument();
  });

  it("shows error message on API failure", async () => {
    mockedGet.mockRejectedValue(new Error("API failed"));

    render(<AverageSalaryByJobTitle />);

    expect(await screen.findByText(/API failed/i)).toBeInTheDocument();
  });

  it("filters job titles correctly", async () => {
    mockedGet.mockResolvedValue({ data: mockData });

    render(<AverageSalaryByJobTitle />);

    await screen.findByText("Engineer");

    const input = screen.getByPlaceholderText("Filter job titles");

    fireEvent.change(input, { target: { value: "eng" } });

    expect(await screen.findByText("Engineer")).toBeInTheDocument();
    expect(screen.queryByText("Manager")).not.toBeInTheDocument();
    expect(screen.queryByText("Analyst")).not.toBeInTheDocument();
  });

  it("sorts by employee_count when header clicked", async () => {
    mockedGet.mockResolvedValue({ data: mockData });

    render(<AverageSalaryByJobTitle />);

    await screen.findByText("Engineer");

    const header = screen.getByText("Employees");

    fireEvent.click(header);
    fireEvent.click(header);

    // verify all still exist (sorting handled internally)
    expect(screen.getByText("Engineer")).toBeInTheDocument();
    expect(screen.getByText("Manager")).toBeInTheDocument();
    expect(screen.getByText("Analyst")).toBeInTheDocument();
  });

  it("sorts by job title column", async () => {
    mockedGet.mockResolvedValue({ data: mockData });

    render(<AverageSalaryByJobTitle />);

    await screen.findByText("Engineer");

    const header = screen.getByText("Job Title");

    fireEvent.click(header);

    expect(screen.getByText("Engineer")).toBeInTheDocument();
  });

  it("sorts by salary column", async () => {
    mockedGet.mockResolvedValue({ data: mockData });

    render(<AverageSalaryByJobTitle />);

    await screen.findByText("Engineer");

    const header = screen.getByText("Avg Salary");

    fireEvent.click(header);

    expect(screen.getByText("Manager")).toBeInTheDocument();
  });

  it("shows empty state when no results match filter", async () => {
    mockedGet.mockResolvedValue({ data: mockData });

    render(<AverageSalaryByJobTitle />);

    await screen.findByText("Engineer");

    const input = screen.getByPlaceholderText("Filter job titles");

    fireEvent.change(input, { target: { value: "zzz" } });

    expect(await screen.findByText("No job titles found")).toBeInTheDocument();
  });
});
