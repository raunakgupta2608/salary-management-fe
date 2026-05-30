import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Mock } from "vitest";

vi.mock("react-redux", () => ({
  useSelector: vi.fn(),
}));

import { useSelector } from "react-redux";
import AnalyticsChart from "../pages/AnalyticsChart";

vi.mock("react-chartjs-2", () => ({
  Pie: () => <div data-testid="pie-chart" />,
}));

const mockedUseSelector = useSelector as unknown as Mock;

const mockEmployees = [
  { id: 1, name: "A", department: "HR", salary: 1000 },
  { id: 2, name: "B", department: "HR", salary: 2000 },
  { id: 3, name: "C", department: "IT", salary: 3000 },
];

describe("AnalyticsChart", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state", () => {
    mockedUseSelector.mockReturnValue({
      employees: [],
      loading: true,
      error: null,
    });

    render(<AnalyticsChart />);

    expect(screen.getByText(/Loading analytics/i)).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockedUseSelector.mockReturnValue({
      employees: [],
      loading: false,
      error: "Something went wrong",
    });

    render(<AnalyticsChart />);

    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it("shows empty state", () => {
    mockedUseSelector.mockReturnValue({
      employees: [],
      loading: false,
      error: null,
    });

    render(<AnalyticsChart />);

    expect(screen.getByText(/No employee data available/i)).toBeInTheDocument();
  });

  it("renders chart and summary", () => {
    mockedUseSelector.mockReturnValue({
      employees: mockEmployees,
      loading: false,
      error: null,
    });

    render(<AnalyticsChart />);

    expect(screen.getByTestId("pie-chart")).toBeInTheDocument();
    expect(screen.getByText(/Summary/i)).toBeInTheDocument();

    expect(screen.getByText("HR")).toBeInTheDocument();
    expect(screen.getByText("IT")).toBeInTheDocument();
  });
});
