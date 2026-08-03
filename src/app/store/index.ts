import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import inventoryReducer from './slices/inventorySlice';
import customerReducer from './slices/customerSlice';
import salesReducer from './slices/salesSlice';
import purchaseOrderReducer from './slices/purchaseOrderSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    inventory: inventoryReducer,
    customers: customerReducer,
    sales: salesReducer,
    purchases: purchaseOrderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;