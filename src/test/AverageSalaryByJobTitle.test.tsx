import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../api/axiosClient", () => {
  return {
    default: {
      get: vi.fn(),
    },
  };
});

import apiClient from "../api/axiosClient";
import AverageSalaryByJobTitle from "../pages/analytics/AverageSalaryByJobTitle";

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
  it("shows loading state initially", async () => {
    mockedGet.mockReturnValue(new Promise(() => {}));

    render(<AverageSalaryByJobTitle />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders data after successful fetch", async () => {
    mockedGet.mockResolvedValue({ data: mockData });

    render(<AverageSalaryByJobTitle />);

    expect(await screen.findByText("Engineer")).toBeInTheDocument();
    expect(screen.getByText("Manager")).toBeInTheDocument();
    expect(screen.getByText("Analyst")).toBeInTheDocument();
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

    expect(screen.getByText("Engineer")).toBeInTheDocument();
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

    expect(screen.getByText("Engineer")).toBeInTheDocument();
    expect(screen.getByText("Manager")).toBeInTheDocument();
  });

  it("sorts by job title", async () => {
    mockedGet.mockResolvedValue({ data: mockData });

    render(<AverageSalaryByJobTitle />);

    await screen.findByText("Engineer");

    const header = screen.getByText("Job title");

    fireEvent.click(header);

    expect(screen.getByText("Engineer")).toBeInTheDocument();
  });

  it("sorts by salary column", async () => {
    mockedGet.mockResolvedValue({ data: mockData });

    render(<AverageSalaryByJobTitle />);

    await screen.findByText("Engineer");

    const header = screen.getByText("Avg salary");

    fireEvent.click(header);

    expect(screen.getByText("Manager")).toBeInTheDocument();
  });
});
