import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DataTable, type Column } from "./DataTable";

type User = {
  id: number;
  name: string;
  salary: number;
};

const mockRows: User[] = [
  {
    id: 1,
    name: "John",
    salary: 50000,
  },
  {
    id: 2,
    name: "Jane",
    salary: 60000,
  },
];

const columns: Column<User>[] = [
  {
    key: "name",
    title: "Name",
    sortable: true,
  },
  {
    key: "salary",
    title: "Salary",
    sortable: true,
    align: "right",
  },
];

describe("DataTable", () => {
  it("renders table headers", () => {
    render(<DataTable rows={mockRows} columns={columns} />);

    expect(screen.getByText("Name")).toBeInTheDocument();

    expect(screen.getByText("Salary")).toBeInTheDocument();
  });

  it("renders row data", () => {
    render(<DataTable rows={mockRows} columns={columns} />);

    expect(screen.getByText("John")).toBeInTheDocument();

    expect(screen.getByText("Jane")).toBeInTheDocument();

    expect(screen.getByText("50000")).toBeInTheDocument();

    expect(screen.getByText("60000")).toBeInTheDocument();
  });

  it("renders empty message when rows are empty", () => {
    render(
      <DataTable rows={[]} columns={columns} emptyMessage="No users found" />,
    );

    expect(screen.getByText("No users found")).toBeInTheDocument();
  });

  it("renders default empty message", () => {
    render(<DataTable rows={[]} columns={columns} />);

    expect(screen.getByText("No data found")).toBeInTheDocument();
  });

  it("calls onSort when sortable header is clicked", () => {
    const onSort = vi.fn();

    render(<DataTable rows={mockRows} columns={columns} onSort={onSort} />);

    fireEvent.click(screen.getByText("Name"));

    expect(onSort).toHaveBeenCalledTimes(1);
    expect(onSort).toHaveBeenCalledWith("name");
  });

  it("does not call onSort when onSort is not provided", () => {
    render(<DataTable rows={mockRows} columns={columns} />);

    expect(() => {
      fireEvent.click(screen.getByText("Name"));
    }).not.toThrow();
  });

  it("renders custom cell content using render function", () => {
    const customColumns: Column<User>[] = [
      {
        key: "name",
        title: "Employee",
        render: (_, row) => <span>Employee: {row.name}</span>,
      },
    ];

    render(<DataTable rows={mockRows} columns={customColumns} />);

    expect(screen.getByText("Employee: John")).toBeInTheDocument();

    expect(screen.getByText("Employee: Jane")).toBeInTheDocument();
  });

  it("applies right alignment class", () => {
    render(<DataTable rows={mockRows} columns={columns} />);

    const salaryHeader = screen.getByText("Salary");

    expect(salaryHeader).toHaveClass("text-right");
  });

  it("applies sortable cursor class", () => {
    render(<DataTable rows={mockRows} columns={columns} />);

    const nameHeader = screen.getByText("Name");

    expect(nameHeader).toHaveClass("cursor-pointer");
  });
});
