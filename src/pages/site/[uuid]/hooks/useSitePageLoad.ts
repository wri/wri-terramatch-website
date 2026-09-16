import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";

import { useFullSite } from "@/connections/Entity";
import { useValueChanged } from "@/hooks/useValueChanged";
import Log from "@/utils/log";

export const useSitePageLoad = (siteUUID: string | undefined) => {
  const t = useT();
  const hasSiteUuid = siteUUID != null && siteUUID !== "";
  const [isLoaded, { data: site, loadFailure, refetch }] = useFullSite({ id: siteUUID ?? "" });

  useValueChanged(isLoaded, () => {
    if (!hasSiteUuid) return;
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

  return { isLoaded: hasSiteUuid && isLoaded, site, loadFailure, refetch };
};
