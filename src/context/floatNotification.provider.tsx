import React, { useContext } from "react";

import FloatNotification from "@/components/elements/Notification/FloatNotification";

type FloatNotificationContextType = {
  data: { label: string; site: string; value: string }[];
  addDataFloatNotification: (data: FloatNotificationContextType["data"]) => void;
};

export const FloatNotificationContext = React.createContext<FloatNotificationContextType>({
  data: [],
  addDataFloatNotification: () => {}
});

type FloatNotificationProviderProps = {
  children: React.ReactNode;
};

const FloatNotificationProvider = ({ children }: FloatNotificationProviderProps) => {
  const [data, setData] = React.useState<FloatNotificationContextType["data"]>([]);

  const addDataFloatNotification = (data: FloatNotificationContextType["data"]) => {
    setData(data);
  };

  const value = React.useMemo(
    () => ({
      data,
      addDataFloatNotification
    }),
    [data]
  );

  return (
    <FloatNotificationContext.Provider value={value}>
      {children}
      <FloatNotification data={data} />
    </FloatNotificationContext.Provider>
  );
};

export const useFloatNotificationContex = () => useContext(FloatNotificationContext);

export default FloatNotificationProvider;
