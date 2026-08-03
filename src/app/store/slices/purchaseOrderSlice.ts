import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import type { PurchaseOrder } from '@/types';

interface PurchaseOrderState {
  purchases: PurchaseOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: PurchaseOrderState = {
  purchases: [],
  loading: false,
  error: null,
};

export const fetchPurchaseOrders = createAsyncThunk('purchases/fetchPurchaseOrders', async () => {
  return await api.getPurchaseOrders();
});

const purchaseOrderSlice = createSlice({
  name: 'purchases',
  initialState,
  reducers: {
    addPurchaseOrder(state, action) {
      state.purchases.unshift(action.payload);
    },
    updatePOStatus(state, action) {
      const po = state.purchases.find(p => p.id === action.payload.id);
      if (po) {
        po.status = action.payload.status;
        po.updatedAt = new Date().toISOString();
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchaseOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPurchaseOrders.fulfilled, (state, action) => { state.loading = false; state.purchases = action.payload; })
      .addCase(fetchPurchaseOrders.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to load purchase orders'; });
  },
});

export const { addPurchaseOrder, updatePOStatus } = purchaseOrderSlice.actions;
export default purchaseOrderSlice.reducer;