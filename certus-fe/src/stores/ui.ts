import { defineStore } from 'pinia';

interface SnackbarState {
  show: boolean;
  message: string;
  color: 'success' | 'error' | 'info' | 'warning';
}

export const useUiStore = defineStore('ui', {
  state: (): { snackbar: SnackbarState } => ({
    snackbar: {
      show: false,
      message: '',
      color: 'info'
    }
  }),
  actions: {
    notify(message: string, color: SnackbarState['color'] = 'info') {
      this.snackbar = { show: true, message, color };
    },
    closeSnackbar() {
      this.snackbar.show = false;
    }
  }
});
