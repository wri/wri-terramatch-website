import { useT } from "@transifex/react";

import { ToastType, useToastContext } from "@/context/toast.provider";
import { fetchGetV2ENTITYUUIDExport } from "@/generated/apiComponents";
import { EntityName } from "@/types/common";
import { downloadFileBlob } from "@/utils/network";

export const useGetExportEntityHandler = (
  entity: EntityName,
  uuid: string,
  name?: string,
  extension: string = "zip"
) => {
  const t = useT();
  const { openToast } = useToastContext();

  return {
    handleExport: () => {
      fetchGetV2ENTITYUUIDExport({ pathParams: { entity, uuid } })
        .then((response: any) => {
          downloadFileBlob(response, `${entity}-${name}.${extension}`);
          openToast(t(`{name} successfully exported`, { name }));
        })
        .catch(() => {
          openToast(t("Something went wrong!"), ToastType.ERROR);
        });
    }
  };
};
