import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import type { Bike } from '@/types';

interface InventoryState {
  bikes: Bike[];
  parts: any[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  bikes: [],
  parts: [],
  loading: false,
  error: null,
};

export const fetchBikes = createAsyncThunk('inventory/fetchBikes', async () => {
  return await api.getBikes();
});

export const fetchParts = createAsyncThunk('inventory/fetchParts', async () => {
  return await api.getParts();
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    addBike(state, action) {
      state.bikes.push(action.payload);
    },
    updateBike(state, action) {
      const idx = state.bikes.findIndex(b => b.id === action.payload.id);
      if (idx >= 0) state.bikes[idx] = action.payload;
    },
    deleteBike(state, action) {
      state.bikes = state.bikes.filter(b => b.id !== action.payload);
    },
    addParts(state, action) {
      state.parts.push(...action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBikes.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBikes.fulfilled, (state, action) => { state.loading = false; state.bikes = action.payload; })
      .addCase(fetchBikes.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to load bikes'; })
      .addCase(fetchParts.pending, (state) => { state.loading = true; })
      .addCase(fetchParts.fulfilled, (state, action) => { state.loading = false; state.parts = action.payload; })
      .addCase(fetchParts.rejected, (state, action) => { state.loading = false; state.error = action.error.message || 'Failed to load parts'; });
  },
});

export const { addBike, updateBike, deleteBike, addParts } = inventorySlice.actions;
export default inventorySlice.reducer;