import { useCallback } from "react";

import { useMapAreaContext } from "@/context/mapArea.provider";

const useAlertHook = () => {
  const { setpolygonNotificationStatus } = useMapAreaContext();

  const displayNotification = useCallback(
    (message: string, type: "success" | "error" | "warning", title: string) => {
      const time = type === "success" ? 3000 : 5000;
      setpolygonNotificationStatus({
        open: true,
        message,
        type,
        title
      });
      setTimeout(() => {
        setpolygonNotificationStatus({
          open: false,
          message: "",
          type: "success",
          title: ""
        });
      }, time);
    },
    [setpolygonNotificationStatus]
  );

  return { displayNotification };
};

export default useAlertHook;
