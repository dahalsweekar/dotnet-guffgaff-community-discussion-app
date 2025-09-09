export interface DialogData {
  type: 'information' | 'error' | 'validation' | 'success';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}
