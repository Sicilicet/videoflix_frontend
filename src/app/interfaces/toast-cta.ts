export interface ToastCTA {
    message: string;
    textButton: string;
    action: (param?: any) => void;
  }