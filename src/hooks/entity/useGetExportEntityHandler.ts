import { useT } from "@transifex/react";
import { closeToast, showToast } from "@worldresources/wri-design-systems";
import { startCase } from "lodash";
import { useCallback, useState } from "react";

import { SupportedEntity } from "@/connections/Entity";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { entityExport } from "@/generated/v3/entityService/entityServiceComponents";
import { singularEntityName, v3EntityName } from "@/helpers/entity";
import { EntityName } from "@/types/common";
import Log from "@/utils/log";

/**
 * To get entity export handler
 */
export const useGetExportEntityHandler = (entity: EntityName, uuid: string) => {
  const t = useT();
  const { openToast } = useToastContext();
  const [loading, setLoading] = useState(false);

  const handleExport = useCallback(async () => {
    setLoading(true);

    showToast({
      id: "exportToast",
      label: t(`Exporting ${startCase(singularEntityName(entity))}...`),
      type: "loading",
      placement: "bottom",
      maxWidth: "auto"
    });

    try {
      const entityName = v3EntityName(entity) as SupportedEntity;
      await entityExport.downloadFile({ pathParams: { entity: entityName, uuid } });
      closeToast("exportToast");
      showToast({
        label: t(`${startCase(singularEntityName(entity))} successfully exported`),
        type: "success",
        placement: "bottom",
        duration: 5000,
        maxWidth: "auto"
      });
    } catch (error) {
      Log.error("Error exporting entity", error);
      closeToast("exportToast");
      openToast(t("Something went wrong!"), ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  }, [entity, openToast, t, uuid]);

  return { handleExport, loading };
};
