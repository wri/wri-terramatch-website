import { useCallback } from "react";

import { useMapAreaContext } from "@/context/mapArea.provider";

const useAlertHook = () => {
  const { setPolygonNotificationStatus } = useMapAreaContext();

  const displayNotification = useCallback(
    (message: string, type: "success" | "error" | "warning", title: string) => {
      const time = type === "success" ? 3000 : 5000;
      setPolygonNotificationStatus({
        open: true,
        message,
        type,
        title
      });
      setTimeout(() => {
        setPolygonNotificationStatus({
          open: false,
          message: "",
          type: "success",
          title: ""
        });
      }, time);
    },
    [setPolygonNotificationStatus]
  );

  return { displayNotification };
};

export default useAlertHook;
