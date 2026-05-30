import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Insights from "../pages/analytics/Insights";

vi.mock("./CountrySalarySummary", () => ({
  default: () => <div data-testid="country-salary-summary" />,
}));

vi.mock("./AverageSalaryByJobTitle", () => ({
  default: () => <div data-testid="avg-salary-by-job" />,
}));

describe("Insights", () => {
  it("renders both analytics components", () => {
    render(<Insights />);

    expect(screen.getByTestId("country-salary-summary")).toBeInTheDocument();
    expect(screen.getByTestId("avg-salary-by-job")).toBeInTheDocument();
  });

  it("renders container element", () => {
    const { container } = render(<Insights />);

    expect(container.firstChild).toBeInTheDocument();
  });
});
