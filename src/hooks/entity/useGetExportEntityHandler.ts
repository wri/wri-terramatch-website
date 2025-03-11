import { useT } from "@transifex/react";
import { useState } from "react";

import { ToastType, useToastContext } from "@/context/toast.provider";
import { fetchGetV2ENTITYUUIDExport } from "@/generated/apiComponents";
import { EntityName } from "@/types/common";
import { downloadFileBlob } from "@/utils/network";

/**
 * To get entity export handler
 * @param entity EntityName
 * @param uuid string
 * @param name string
 * @param extension string = "zip"
 * @returns { handleExport }
 */
export const useGetExportEntityHandler = (
  entity: EntityName,
  uuid: string,
  name?: string | null,
  extension: string = "zip"
) => {
  const t = useT();
  const { openToast } = useToastContext();
  const [loading, setLoading] = useState(false);

  const onSuccess = (response: any) => {
    downloadFileBlob(response, `${entity}-${name}.${extension}`);
    openToast(t(`{name} successfully exported`, { name }));
  };

  const onError = () => {
    openToast(t("Something went wrong!"), ToastType.ERROR);
  };

  return {
    handleExport: () => {
      setLoading(true);
      fetchGetV2ENTITYUUIDExport({ pathParams: { entity, uuid } })
        .then((response: any) => {
          if (response.message) {
            return fetchGetV2ENTITYUUIDExport({ pathParams: { entity, uuid }, queryParams: { force: true } });
          } else {
            return response;
          }
        })
        .then(onSuccess)
        .catch(onError)
        .finally(() => {
          setLoading(false);
        });
    },
    loading
  };
};
