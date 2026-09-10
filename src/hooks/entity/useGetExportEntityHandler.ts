import { useT } from "@transifex/react";
import { startCase } from "lodash";
import { useCallback, useState } from "react";

import { SupportedEntity } from "@/connections/Entity";
import { entityExport } from "@/generated/v3/entityService/entityServiceComponents";
import { singularEntityName, v3EntityName } from "@/helpers/entity";
import { useDownloadToastMessages } from "@/hooks/translation/useDownloadToastMessages";
import { EntityName, SingularEntityName } from "@/types/common";
import { runWithDownloadToast } from "@/utils/downloadToast";
import Log from "@/utils/log";

/**
 * To get entity export handler
 */
export const useGetExportEntityHandler = (entity: EntityName | SingularEntityName | string, uuid: string) => {
  const t = useT();
  const downloadToastMessages = useDownloadToastMessages();
  const [loading, setLoading] = useState(false);

  const handleExport = useCallback(async () => {
    setLoading(true);

    const entityLabel = startCase(singularEntityName(entity as EntityName | SingularEntityName));

    try {
      await runWithDownloadToast(
        {
          downloading: t(`Downloading {entityLabel}`, { entityLabel: t(entityLabel) }),
          complete: downloadToastMessages.complete,
          error: downloadToastMessages.error
        },
        async () => {
          const entityName = v3EntityName(entity as EntityName | SingularEntityName) as SupportedEntity;
          await entityExport.downloadFile({ pathParams: { entity: entityName, uuid } });
        },
        "exportToast"
      );
    } catch (error) {
      Log.error("Error exporting entity", error);
    } finally {
      setLoading(false);
    }
  }, [downloadToastMessages, entity, t, uuid]);

  return { handleExport, loading };
};
