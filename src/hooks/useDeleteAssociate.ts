import { useNotificationContext } from "@/context/notification.provider";
import {
  useDeleteV2ProjectsUUIDEMAILRemovePartner,
  useDeleteV2ProjectsUUIDManagersUSERUUID
} from "@/generated/apiComponents";

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

export function useDeleteAssociate(type: keyof typeof DELETE_APIS, project: any, refetch: () => void) {
  const { api, idKey } = DELETE_APIS[type];

  const { openNotification } = useNotificationContext();

  const { mutate } = api({
    onSuccess: () => {
      refetch();
      openNotification("success", "Success!", "Partner deleted successfully");
    },
    onError: () => {
      openNotification("error", "Error!", "Partner deletion failed");
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
    deletePartner
  };
}
