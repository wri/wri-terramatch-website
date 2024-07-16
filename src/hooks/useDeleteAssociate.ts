import { useState } from "react";

import {
  useDeleteV2ProjectsUUIDEMAILRemovePartner,
  useDeleteV2ProjectsUUIDManagersUSERUUID
} from "@/generated/apiComponents";

interface NotificationStatus {
  open: boolean;
  message: string;
  type: "success" | "error" | "warning";
  title: string;
}

const DELETE_APIS = {
  partner: {
    api: useDeleteV2ProjectsUUIDEMAILRemovePartner,
    idKey: "email"
  },
  manager: {
    api: useDeleteV2ProjectsUUIDManagersUSERUUID,
    idKey: "userUuid"
  }
};

const CLOSED_STATE: NotificationStatus = {
  open: false,
  message: "",
  type: "success",
  title: ""
};

export function useDeleteAssociate(type: keyof typeof DELETE_APIS, project: any, refetch: () => void) {
  const { api, idKey } = DELETE_APIS[type];
  const [notificationStatus, setNotificationStatus] = useState<NotificationStatus>(CLOSED_STATE);

  const closeNotification = () => setNotificationStatus(CLOSED_STATE);

  const { mutate } = api({
    onSuccess: () => {
      refetch();
      setNotificationStatus({
        open: true,
        message: "Partner deleted successfully",
        type: "success",
        title: "Success!"
      });
      setTimeout(closeNotification, 3000);
    },
    onError: () => {
      setNotificationStatus({
        open: true,
        message: "Partner deletion failed",
        type: "error",
        title: "Error!"
      });
      setTimeout(closeNotification, 3000);
    }
  });

  const deletePartner = async (id: string) => {
    await mutate({
      // @ts-ignore
      pathParams: {
        uuid: project?.uuid,
        [idKey]: id
      }
    });
  };

  return {
    notificationStatus,
    deletePartner
  };
}
