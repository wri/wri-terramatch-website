import { useT } from "@transifex/react";
import { useCallback, useState } from "react";

import { downloadProjectZip, SupportedEntity } from "@/connections/Entity";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { entityExport } from "@/generated/v3/entityService/entityServiceComponents";
import { v3EntityName } from "@/helpers/entity";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";
import { downloadFileBlob, downloadFileUrl } from "@/utils/network";

/**
 * To get entity export handler
 */
export const useGetExportEntityHandler = (entity: EntityName, uuid: string) => {
  const t = useT();
  const { openToast } = useToastContext();
  const [loading, setLoading] = useState(false);

  const handleExport = useCallback(async () => {
    setLoading(true);

    const reportError = (error?: any) => {
      Log.error("Error exporting entity", error);
      openToast(t("Something went wrong!"), ToastType.ERROR);
    };

    try {
      const entityName = v3EntityName(entity) as SupportedEntity;
      if (entityName === "projects") {
        const { data, loadFailure } = await downloadProjectZip(uuid);
        if (loadFailure != null) {
          reportError(loadFailure);
        } else {
          downloadFileUrl(data?.url as string);
          openToast(t(`${entity} successfully exported`, { entity }));
        }
      } else {
        const { fileName, blob } = await entityExport.fetchBlob({ pathParams: { entity: entityName, uuid } });
        await downloadFileBlob(blob, fileName as string);
        openToast(t(`${entity} successfully exported`, { entity }));
      }
    } catch (error) {
      reportError(error);
    } finally {
      setLoading(false);
    }
  }, [entity, openToast, t, uuid]);

  return { handleExport, loading };
};
