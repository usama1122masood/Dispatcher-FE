import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../index';

export type ThemeMode = 'light' | 'dark';

interface ThemeState {
  mode: ThemeMode;
}

const getInitialTheme = (): ThemeMode => {
  const storedTheme = localStorage.getItem('theme') as ThemeMode | null;
  if (storedTheme) {
    return storedTheme;
  }
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  return 'light';
};

const initialState: ThemeState = {
  mode: getInitialTheme(),
};

// Helper function to notify remote apps about theme changes
const notifyRemoteApps = (mode: ThemeMode) => {
  // Dispatch custom event for same-origin micro-frontends
  const themeChangeEvent = new CustomEvent('themeChange', {
    detail: { mode, isDarkMode: mode === 'dark' },
    bubbles: true,
  });
  window.dispatchEvent(themeChangeEvent);

  // Use postMessage for cross-origin or iframe communication
  // This will work if the remote app is in an iframe or different origin
  if (window.parent !== window) {
    window.parent.postMessage(
      {
        type: 'THEME_CHANGE',
        payload: { mode, isDarkMode: mode === 'dark' },
      },
      '*' // In production, specify the exact origin for security
    );
  }

  // Also broadcast to all iframes within the app
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach((iframe) => {
    iframe.contentWindow?.postMessage(
      {
        type: 'THEME_CHANGE',
        payload: { mode, isDarkMode: mode === 'dark' },
      },
      '*'
    );
  });
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      localStorage.setItem('theme', action.payload);
      // Apply theme to document
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      // Notify remote apps about theme change
      notifyRemoteApps(action.payload);
    },
    toggleTheme: (state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      state.mode = newMode;
      localStorage.setItem('theme', newMode);
      // Apply theme to document
      // if (newMode === 'dark') {
      //   document.documentElement.classList.add('dark');
      // } else {
      //   document.documentElement.classList.remove('dark');
      // }
      // Notify remote apps about theme change
      notifyRemoteApps(newMode);
    },
  },
});

export const { setTheme, toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;

export const selectThemeMode = (state: RootState) => state.theme.mode;
export const selectIsDarkMode = (state: RootState) => state.theme.mode === 'dark';