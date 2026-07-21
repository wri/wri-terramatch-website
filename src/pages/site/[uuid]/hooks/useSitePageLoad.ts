import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";

import { useFullSite } from "@/connections/Entity";
import { useValueChanged } from "@/hooks/useValueChanged";
import Log from "@/utils/log";

export const useSitePageLoad = (siteUUID: string) => {
  const t = useT();
  const [isLoaded, { data: site, loadFailure, refetch }] = useFullSite({ id: siteUUID });

  useValueChanged(isLoaded, () => {
    if (isLoaded && site == null) {
      Log.error("Site not found", { siteUUID, loadFailure });
      showToast({
        label: t("Site not found"),
        type: "error",
        id: "site-not-found",
        placement: "bottom",
        duration: 5000,
        maxWidth: "auto"
      });
    }
  });

  return { isLoaded, site, loadFailure, refetch };
};
