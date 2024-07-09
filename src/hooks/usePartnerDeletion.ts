import { useState } from "react";

import { useDeleteV2ProjectsUUIDEMAILRemovePartner } from "@/generated/apiComponents";

interface NotificationStatus {
  open: boolean;
  message: string;
  type: "success" | "error" | "warning";
  title: string;
}

export const useDeletePartner = (project: any, refetch: () => void) => {
  const [notificationStatus, setNotificationStatus] = useState<NotificationStatus>({
    open: false,
    message: "",
    type: "success",
    title: "Success!"
  });

  const { mutate } = useDeleteV2ProjectsUUIDEMAILRemovePartner({
    onSuccess: () => {
      refetch();
      setNotificationStatus({
        open: true,
        message: "Partner deleted successfully",
        type: "success",
        title: "Success!"
      });
      setTimeout(() => {
        setNotificationStatus({
          open: false,
          message: "",
          type: "success",
          title: "Success!"
        });
      }, 3000);
    },
    onError: () => {
      setNotificationStatus({
        open: true,
        message: "Partner deletion failed",
        type: "error",
        title: "Error!"
      });
      setTimeout(() => {
        setNotificationStatus({
          open: false,
          message: "",
          type: "error",
          title: "Error!"
        });
      }, 3000);
    }
  });

  const deletePartner = async (email_address: string) => {
    await mutate({
      pathParams: {
        uuid: project?.uuid,
        email: email_address
      }
    });
  };

  return {
    notificationStatus,
    deletePartner
  };
};
