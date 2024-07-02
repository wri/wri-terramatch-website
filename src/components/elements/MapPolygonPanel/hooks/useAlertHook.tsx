import { useCallback } from "react";

import { useMapAreaContext } from "@/context/mapArea.provider";

const useAlertHook = () => {
  const { setpolygonNotificationStatus } = useMapAreaContext();

  const displayNotification = useCallback(
    (message: string, type: "success" | "error" | "warning", title: string) => {
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
      }, 3000);
    },
    [setpolygonNotificationStatus]
  );

  return { displayNotification };
};

export default useAlertHook;
