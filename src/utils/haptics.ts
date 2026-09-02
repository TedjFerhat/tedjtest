export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'shatter' | 'success' = 'light') => {
  if (typeof window === 'undefined' || !('navigator' in window) || !('vibrate' in navigator)) {
    return;
  }

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(15);
        break;
      case 'medium':
        navigator.vibrate(35);
        break;
      case 'heavy':
        navigator.vibrate([40, 20, 40]);
        break;
      case 'shatter':
        navigator.vibrate([60, 30, 80, 40, 100]);
        break;
      case 'success':
        navigator.vibrate([20, 50, 30]);
        break;
      default:
        navigator.vibrate(20);
    }
  } catch {
    // Gracefully ignore vibration errors on unsupported platforms
  }
};
