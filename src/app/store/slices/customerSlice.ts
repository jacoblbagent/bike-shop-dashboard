import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import type { Customer } from '@/types';

interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk('customers/fetchCustomers', async () => {
  return await api.getCustomers();
});

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    addCustomers(state, action) {
      state.customers.push(...action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchCustomers.fulfilled, (state, action) => { state.loading = false; state.customers = action.payload; })
      .addCase(fetchCustomers.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to load customers'; });
  },
});

export const { addCustomers } = customerSlice.actions;
export default customerSlice.reducer;