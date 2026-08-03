import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import type { Order } from '@/types';

interface SalesState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: SalesState = {
  orders: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk('sales/fetchOrders', async () => {
  return await api.getOrders();
});

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    addOrder(state, action) {
      state.orders.unshift(action.payload);
    },
    updateOrderStatus(state, action) {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
        order.updatedAt = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchOrders.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to load orders'; });
  },
});

export const { addOrder, updateOrderStatus } = salesSlice.actions;
export default salesSlice.reducer;