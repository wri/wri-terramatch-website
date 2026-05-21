import React, { useCallback, useContext, useMemo, useState } from "react";

import Notification from "@/components/elements/Notification/Notification";
import { TranslatedText } from "@/i18n/types";

type NotificationType = "success" | "error" | "warning" | null;

type NotificationContextType = {
  openNotification: (
    type: Exclude<NotificationType, null>,
    title: TranslatedText,
    message?: TranslatedText | any
  ) => void;
  closeNotification: () => void;
  notificationProps: {
    type: NotificationType;
    title: TranslatedText;
    message?: TranslatedText | any;
    open: boolean;
  };
};

export const NotificationContext = React.createContext<NotificationContextType>({
  openNotification: () => {},
  closeNotification: () => {},
  notificationProps: {
    type: null,
    title: "" as TranslatedText,
    message: undefined,
    open: false
  }
});

type NotificationProviderProps = {
  children: React.ReactNode;
};

const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const [notificationProps, setNotificationProps] = useState({
    type: null as NotificationType,
    title: "" as TranslatedText,
    message: undefined,
    open: false
  });

  const openNotification = useCallback(
    (type: Exclude<NotificationType, null>, title: TranslatedText, message?: TranslatedText | any) => {
      setNotificationProps({ type, title, message: message ?? undefined, open: true });
    },
    []
  );

  const closeNotification = useCallback(() => {
    setNotificationProps(prev => ({ ...prev, open: false }));
  }, []);

  const value = useMemo(
    () => ({
      openNotification,
      closeNotification,
      notificationProps
    }),
    [closeNotification, notificationProps, openNotification]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notificationProps.open && (
        <Notification
          type={notificationProps.type as Exclude<NotificationType, null>}
          title={notificationProps.title}
          message={notificationProps.message}
          open={notificationProps.open}
          closeNotification={closeNotification}
        />
      )}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
export default NotificationProvider;
