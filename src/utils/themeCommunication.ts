/**
 * Theme Communication Utility
 * 
 * This file documents how the remote micro-frontend app should listen to theme changes
 * from the host application.
 * 
 * The host app sends theme changes via:
 * 1. Props (isDarkMode prop passed to RemoteApp component)
 * 2. Custom Events (window 'themeChange' and 'remoteAppThemeChange' events)
 * 3. PostMessage API (for cross-origin/iframe communication)
 * 
 * Remote App Implementation Example:
 * 
 * // Option 1: Listen to Custom Events (same-origin)
 * useEffect(() => {
 *   const handleThemeChange = (event: CustomEvent) => {
 *     const { isDarkMode, mode } = event.detail;
 *     // Update map tiles based on theme
 *     updateMapTheme(isDarkMode);
 *   };
 * 
 *   window.addEventListener('themeChange', handleThemeChange as EventListener);
 *   window.addEventListener('remoteAppThemeChange', handleThemeChange as EventListener);
 * 
 *   return () => {
 *     window.removeEventListener('themeChange', handleThemeChange as EventListener);
 *     window.removeEventListener('remoteAppThemeChange', handleThemeChange as EventListener);
 *   };
 * }, []);
 * 
 * // Option 2: Listen to PostMessage (cross-origin/iframe)
 * useEffect(() => {
 *   const handleMessage = (event: MessageEvent) => {
 *     // Verify message source for security (in production)
 *     // if (event.origin !== 'http://localhost:4173') return;
 * 
 *     if (event.data?.type === 'THEME_CHANGE' && event.data?.source === 'radio-dispatcher-host') {
 *       const { isDarkMode, mode } = event.data.payload;
 *       // Update map tiles based on theme
 *       updateMapTheme(isDarkMode);
 *     }
 *   };
 * 
 *   window.addEventListener('message', handleMessage);
 * 
 *   return () => {
 *     window.removeEventListener('message', handleMessage);
 *   };
 * }, []);
 * 
 * // Option 3: Use the prop directly (if RemoteApp receives isDarkMode prop)
 * const RemoteApp = ({ isDarkMode, ...otherProps }) => {
 *   useEffect(() => {
 *     // Update map tiles when isDarkMode prop changes
 *     updateMapTheme(isDarkMode);
 *   }, [isDarkMode]);
 * 
 *   // ... rest of component
 * };
 */

export interface ThemeChangeEvent {
  type: 'THEME_CHANGE';
  source: 'radio-dispatcher-host';
  payload: {
    isDarkMode: boolean;
    mode: 'light' | 'dark';
  };
}

export interface ThemeChangeCustomEvent extends CustomEvent {
  detail: {
    isDarkMode: boolean;
    mode: 'light' | 'dark';
  };
}

/**
 * Helper function to check if a message event is a theme change event
 */
export const isThemeChangeMessage = (event: MessageEvent): event is MessageEvent<ThemeChangeEvent> => {
  return (
    event.data?.type === 'THEME_CHANGE' &&
    event.data?.source === 'radio-dispatcher-host' &&
    typeof event.data?.payload?.isDarkMode === 'boolean'
  );
};

/**
 * Helper function to check if a custom event is a theme change event
 */
export const isThemeChangeCustomEvent = (event: Event): event is ThemeChangeCustomEvent => {
  return (
    (event.type === 'themeChange' || event.type === 'remoteAppThemeChange') &&
    'detail' in event &&
    typeof (event as CustomEvent).detail?.isDarkMode === 'boolean'
  );
};

