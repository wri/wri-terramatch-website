import { useT } from "@transifex/react";
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

    try {
      const entityName = v3EntityName(entity) as SupportedEntity;
      await entityExport.downloadFile({ pathParams: { entity: entityName, uuid } });
      openToast(t(`${startCase(singularEntityName(entity))} successfully exported`));
    } catch (error) {
      Log.error("Error exporting entity", error);
      openToast(t("Something went wrong!"), ToastType.ERROR);
    } finally {
      setLoading(false);
    }
  }, [entity, openToast, t, uuid]);

  return { handleExport, loading };
};
