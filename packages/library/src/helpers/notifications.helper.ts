/**
 * Dispatches a lightweight success notification event for host applications.
 *
 * @param message - Notification message.
 */
export function notificationSuccess(message: string): void {
  window.dispatchEvent(
    new CustomEvent('peaui:notification', {
      detail: {
        message,
        type: 'success',
      },
    }),
  );
}
