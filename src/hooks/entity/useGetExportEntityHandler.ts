import { useT } from "@transifex/react";
import { useCallback, useState } from "react";

import { SupportedEntity } from "@/connections/Entity";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { entityExport } from "@/generated/v3/entityService/entityServiceComponents";
import { v3EntityName } from "@/helpers/entity";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";
import { downloadFileBlob } from "@/utils/network";

/**
 * To get entity export handler
 */
export const useGetExportEntityHandler = (entity: EntityName, uuid: string) => {
  const t = useT();
  const { openToast } = useToastContext();
  const [loading, setLoading] = useState(false);

  const handleExport = useCallback(() => {
    setLoading(true);
    entityExport
      .fetchBlob({ pathParams: { entity: v3EntityName(entity) as SupportedEntity, uuid } })
      .then(({ fileName, blob }) =>
        downloadFileBlob(blob, fileName as string).then(() => {
          openToast(t(`${entity} successfully exported`, { entity }));
        })
      )
      .catch(error => {
        Log.error("Error exporting entity", error);
        openToast(t("Something went wrong!"), ToastType.ERROR);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [entity, openToast, t, uuid]);

  return { handleExport, loading };
};
