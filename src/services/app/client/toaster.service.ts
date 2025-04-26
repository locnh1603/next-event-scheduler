import { toast } from 'sonner';

export const showSuccess = (message: string) => {
  toast.success(message, {
    duration: 5000,
    position: 'top-right',
    dismissible: true
  });
}
export const showError = (message: string) => {
  toast.error(message, {
    duration: 5000,
    position: 'top-right',
    dismissible: true
  });
}
