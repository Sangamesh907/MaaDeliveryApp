// RootNavigation.js
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/**
 * Safely navigate to a screen
 * @param {string} name - Screen name
 * @param {object} params - Optional params
 */
export function safeNavigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  } else {
    console.warn(`⚠️ Navigation not ready. Could not navigate to "${name}"`);
  }
}

/**
 * Go back to previous screen
 */
export function goBack() {
  if (navigationRef.isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
}
