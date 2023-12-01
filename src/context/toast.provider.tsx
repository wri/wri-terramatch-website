import React, { useContext, useState } from "react";

import { useDebounce } from "@/hooks/useDebounce";

/* eslint-disable no-unused-vars */
export enum ToastType {
  SUCCESS,
  ERROR
}
const OPEN_TIME = 4000; // 1 second

type ToastContextType = {
  openToast: (text: string, type?: ToastType, time?: number) => void;
  closeToast: () => void;
  details: { text: string; type: ToastType; open: boolean };
};

export const ToastContext = React.createContext<ToastContextType>({
  openToast: () => {},
  closeToast: () => {},
  details: { text: "", type: ToastType.SUCCESS, open: false }
});

type ToastProviderProps = {
  children: React.ReactNode;
};

const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toastDetails, setToastDetails] = useState<ToastContextType["details"]>({
    text: "",
    type: ToastType.SUCCESS,
    open: false
  });

  const openToast = (text: string, type = ToastType.SUCCESS) => {
    setToastDetails({
      text,
      type,
      open: true
    });
    closeModalAfterTime();
  };

  const closeToast = () => {
    setToastDetails(prev => ({
      ...prev,
      open: false
    }));
  };

  const closeModalAfterTime = useDebounce(closeToast, OPEN_TIME);

  return (
    <ToastContext.Provider
      value={{
        openToast,
        closeToast,
        details: toastDetails
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => useContext(ToastContext);

export default ToastProvider;
