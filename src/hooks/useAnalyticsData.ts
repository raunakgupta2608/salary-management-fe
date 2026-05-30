/**
 * Earlier without this hook
    Component
    ├── Fetching
    ├── Filtering
    ├── Sorting
    ├── Formatting
    └── Table Rendering

  After this hook
    useAnalyticsData
    ├── Fetching
    ├── Filtering
    └── Generic Sorting

    DataTable
    └── Rendering

    Page Component
    ├── Endpoint
    ├── Columns
    └── Filter Field
 */

import { useEffect, useMemo, useRef, useState } from "react";

interface AnalyticsConfig<T> {
  fetcher: () => Promise<T[]>;
  filterFn: (item: T, search: string) => boolean;
  defaultSortField: keyof T;

  numericFields?: (keyof T)[];
  dateFields?: (keyof T)[];
}

export function useAnalyticsData<T>({
  fetcher,
  filterFn,
  defaultSortField,
  numericFields = [],
  dateFields = [],
}: AnalyticsConfig<T>) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState<keyof T>(defaultSortField);

  const [sortAsc, setSortAsc] = useState(false);
  const fetcherRef = useRef(fetcher);

  useEffect(() => {
    fetcherRef.current = fetcher;
  }, [fetcher]);

  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : "Unable to load data";

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);

        const data = await fetcherRef.current();

        if (!mounted) return;

        setRows(data);
      } catch (error) {
        if (!mounted) return;

        setError(getErrorMessage(error));
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      mounted = false;
    };
  }, []);

  const processedRows = useMemo(() => {
    let list = [...rows];

    const normalized = filter.trim().toLowerCase();

    if (normalized) {
      list = list.filter((item) => filterFn(item, normalized));
    }

    list.sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];

      if (numericFields.includes(sortField)) {
        return sortAsc ? Number(av) - Number(bv) : Number(bv) - Number(av);
      }

      if (dateFields.includes(sortField)) {
        const ad = new Date(String(av)).getTime();

        const bd = new Date(String(bv)).getTime();

        return sortAsc ? ad - bd : bd - ad;
      }

      return sortAsc
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });

    return list;
  }, [rows, filter, sortField, sortAsc, filterFn, numericFields, dateFields]);

  const toggleSort = (field: keyof T) => {
    if (field === sortField) {
      setSortAsc((prev) => !prev);
      return;
    }

    setSortField(field);
    setSortAsc(false);
  };

  return {
    rows: processedRows,
    loading,
    error,
    filter,
    setFilter,
    toggleSort,
  };
}
