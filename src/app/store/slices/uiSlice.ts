import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const DEFAULT_BOTTOM_NAV = ['/', '/inventory', '/customers', '/sales'];

function loadBottomNav(): string[] {
  try {
    const saved = localStorage.getItem('bottomNav');
    return saved ? (JSON.parse(saved) as string[]).slice(0, 4) : DEFAULT_BOTTOM_NAV;
  } catch {
    return DEFAULT_BOTTOM_NAV;
  }
}

interface UiState {
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark';
  bottomNav: string[];
}

const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark') || 'dark';

const initialState: UiState = {
  sidebarCollapsed: false,
  theme: savedTheme,
  bottomNav: loadBottomNav(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      document.documentElement.setAttribute('data-theme', action.payload);
    },
    setBottomNavSlot(state, action: PayloadAction<{ slot: number; path: string }>) {
      const { slot, path } = action.payload;
      if (slot >= 0 && slot < 4) {
        state.bottomNav[slot] = path;
        localStorage.setItem('bottomNav', JSON.stringify(state.bottomNav));
      }
    },
  },
});

export const { toggleSidebar, setTheme, setBottomNavSlot } = uiSlice.actions;
export default uiSlice.reducer;