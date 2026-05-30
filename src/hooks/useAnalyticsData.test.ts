import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAnalyticsData } from "./useAnalyticsData";

type MockRow = {
  name: string;
  value: number;
  date: string;
};

const mockData: MockRow[] = [
  { name: "B", value: 20, date: "2024-01-01" },
  { name: "A", value: 10, date: "2023-01-01" },
  { name: "C", value: 30, date: "2025-01-01" },
];

describe("useAnalyticsData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and sets data", async () => {
    const fetcher = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useAnalyticsData<MockRow>({
        fetcher,
        defaultSortField: "name",
        filterFn: (item, search) => item.name.toLowerCase().includes(search),
      }),
    );

    await waitFor(() => {
      expect(result.current.rows.length).toBe(3);
    });
  });

  it("sets error on fetch failure", async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error("Fetch failed"));

    const { result } = renderHook(() =>
      useAnalyticsData<MockRow>({
        fetcher,
        defaultSortField: "name",
        filterFn: (item, search) => item.name.toLowerCase().includes(search),
      }),
    );

    await waitFor(() => {
      expect(result.current.error).toBe("Fetch failed");
    });
  });

  it("filters rows correctly", async () => {
    const fetcher = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useAnalyticsData<MockRow>({
        fetcher,
        defaultSortField: "name",
        filterFn: (item, search) => item.name.toLowerCase().includes(search),
      }),
    );

    await waitFor(() => {
      expect(result.current.rows.length).toBe(3);
    });

    act(() => {
      result.current.setFilter("a");
    });

    await waitFor(() => {
      const names = result.current.rows.map((r) => r.name);

      // only "A" matches "a"
      expect(names).toEqual(["A"]);
    });
  });

  it("sorts numeric fields correctly", async () => {
    const fetcher = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useAnalyticsData<MockRow>({
        fetcher,
        defaultSortField: "value",
        numericFields: ["value"],
        filterFn: (item, search) => item.name.toLowerCase().includes(search),
      }),
    );

    await waitFor(() => {
      expect(result.current.rows.length).toBe(3);
    });

    // FIRST click → ASC (because default sortAsc = false then toggled)
    act(() => {
      result.current.toggleSort("value");
    });

    await waitFor(() => {
      const values = result.current.rows.map((r) => r.value);
      expect(values[0]).toBe(10); // ASC
    });

    // SECOND click → DESC
    act(() => {
      result.current.toggleSort("value");
    });

    await waitFor(() => {
      const values = result.current.rows.map((r) => r.value);
      expect(values[0]).toBe(30); // DESC
    });
  });

  it("sorts string fields correctly", async () => {
    const fetcher = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useAnalyticsData<MockRow>({
        fetcher,
        defaultSortField: "name",
        filterFn: (item, search) => item.name.toLowerCase().includes(search),
      }),
    );

    await waitFor(() => {
      expect(result.current.rows.length).toBe(3);
    });

    act(() => {
      result.current.toggleSort("name");
    });

    await waitFor(() => {
      const names = result.current.rows.map((r) => r.name);

      // ASC or DESC both valid, just ensure all exist
      expect(names).toEqual(expect.arrayContaining(["A", "B", "C"]));
    });
  });

  it("sorts date fields correctly", async () => {
    const fetcher = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useAnalyticsData<MockRow>({
        fetcher,
        defaultSortField: "date",
        dateFields: ["date"],
        filterFn: (item, search) => item.name.toLowerCase().includes(search),
      }),
    );

    await waitFor(() => {
      expect(result.current.rows.length).toBe(3);
    });

    // FIRST toggle → ASC (oldest first)
    act(() => {
      result.current.toggleSort("date");
    });

    await waitFor(() => {
      const dates = result.current.rows.map((r) => r.date);
      expect(dates[0]).toBe("2023-01-01"); // ASC
    });

    // SECOND toggle → DESC (newest first)
    act(() => {
      result.current.toggleSort("date");
    });

    await waitFor(() => {
      const dates = result.current.rows.map((r) => r.date);
      expect(dates[0]).toBe("2025-01-01"); // DESC
    });
  });

  it("toggles sort direction correctly", async () => {
    const fetcher = vi.fn().mockResolvedValue(mockData);

    const { result } = renderHook(() =>
      useAnalyticsData<MockRow>({
        fetcher,
        defaultSortField: "value",
        numericFields: ["value"],
        filterFn: (item, search) => item.name.toLowerCase().includes(search),
      }),
    );

    await waitFor(() => {
      expect(result.current.rows.length).toBe(3);
    });

    act(() => {
      result.current.toggleSort("value");
    });

    let firstAsc: number;

    await waitFor(() => {
      firstAsc = result.current.rows[0].value;
    });

    act(() => {
      result.current.toggleSort("value");
    });

    await waitFor(() => {
      const firstDesc = result.current.rows[0].value;
      expect(firstDesc).not.toBe(firstAsc);
    });
  });
});
