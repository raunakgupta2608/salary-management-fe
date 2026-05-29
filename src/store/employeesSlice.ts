import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import apiClient from "../api/axiosClient";

export type Employee = {
  id: number;
  full_name: string;
  job_title: string;
  country: string;
  salary: string;
  department: string;
  email: string;
  employment_status: string;
  created_at: string;
  updated_at: string;
};

type EmployeeResponse = {
  data: Employee[];
  nextCursor: number | null;
  hasMore: boolean;
};

export const fetchEmployeesPage = createAsyncThunk(
  "employees/fetchPage",
  async ({ cursor, limit }: { cursor?: number | null; limit?: number }) => {
    const response = await apiClient.get<EmployeeResponse>("/employee", {
      params: { cursor, limit },
    });

    return response.data as EmployeeResponse;
  },
);

type EmployeesState = {
  employees: Employee[];
  nextCursor: number | null;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
};

const initialState: EmployeesState = {
  employees: [],
  nextCursor: null,
  hasMore: true,
  loading: false,
  error: null,
};

const slice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearEmployees(state) {
      state.employees = [];
      state.nextCursor = null;
      state.hasMore = true;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeesPage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeesPage.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.employees = [...state.employees, ...(payload?.data || [])];
        state.nextCursor = payload?.nextCursor ?? null;
        state.hasMore = payload?.hasMore ?? false;
      })
      .addCase(fetchEmployeesPage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load employees";
      });
  },
});

export const { clearEmployees } = slice.actions;
export default slice.reducer;
