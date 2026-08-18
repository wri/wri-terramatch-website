import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { isEmpty } from "lodash";

import { useFullSite } from "@/connections/Entity";
import { useValueChanged } from "@/hooks/useValueChanged";
import Log from "@/utils/log";

export const useSitePageLoad = (siteUUID: string) => {
  const t = useT();
  const [isLoaded, { data: site, loadFailure, refetch }] = useFullSite({ id: siteUUID });

  useValueChanged(isLoaded, () => {
    // The connection reports `isLoaded` the moment the request settles in *any* terminal state — a
    // real site, a not-found, or a failure. Only a genuine 404 means "this site doesn't exist"; the
    // other terminal states used to masquerade as "Site not found" and must not:
    //   - an empty/undefined uuid: the Next.js router isn't ready on the first render, so there's no
    //     site to look for yet.
    //   - an auth failure (401/403): the session has expired. The global users/me handler already
    //     logs the user out and redirects; surfacing "Site not found" here is misleading (this was
    //     the reported bug — an expired session read as a missing site).
    if (!isLoaded || site != null || isEmpty(siteUUID)) return;

    const statusCode = loadFailure?.statusCode;

    if (statusCode === 401 || statusCode === 403) {
      Log.error("Site load unauthorized; session likely expired", { siteUUID, loadFailure });
      showToast({
        label: t("Your session has expired. Please sign in again."),
        type: "error",
        id: "site-session-expired",
        placement: "bottom",
        duration: 5000,
        maxWidth: "auto"
      });
      return;
    }

    if (statusCode != null && statusCode !== 404) {
      Log.error("Site failed to load", { siteUUID, loadFailure });
      showToast({
        label: t("We couldn't load this site. Please try again."),
        type: "error",
        id: "site-load-failed",
        placement: "bottom",
        duration: 5000,
        maxWidth: "auto"
      });
      return;
    }

    Log.error("Site not found", { siteUUID, loadFailure });
    showToast({
      label: t("Site not found"),
      type: "error",
      id: "site-not-found",
      placement: "bottom",
      duration: 5000,
      maxWidth: "auto"
    });
  });

  return { isLoaded, site, loadFailure, refetch };
};
