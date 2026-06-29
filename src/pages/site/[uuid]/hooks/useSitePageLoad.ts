import { useT } from "@transifex/react";

import { useFullSite } from "@/connections/Entity";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useValueChanged } from "@/hooks/useValueChanged";
import Log from "@/utils/log";

export const useSitePageLoad = (siteUUID: string) => {
  const t = useT();
  const { openToast } = useToastContext();
  const [isLoaded, { data: site, loadFailure, refetch }] = useFullSite({ id: siteUUID });

  useValueChanged(isLoaded, () => {
    if (isLoaded && site == null) {
      Log.error("Site not found", { siteUUID, loadFailure });
      openToast(t("Site not found"), ToastType.ERROR);
    }
  });

  return { isLoaded, site, loadFailure, refetch };
};
