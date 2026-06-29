import { useRouter } from "next/router";
import { useEffect } from "react";

import { useMyUser } from "@/connections/User";

import SitePageProviders from "./components/SitePageProviders";
import { useSitePageLoad } from "./hooks/useSitePageLoad";
import AdminSitePolygonReviewShell from "./sitePolygonReview/AdminSitePolygonReviewShell";

const SitePolygonReviewPage = () => {
  const router = useRouter();
  const siteUUID = router.query.uuid as string;

  const [isUserLoaded, { isAdmin }] = useMyUser();
  const { isLoaded, site } = useSitePageLoad(siteUUID);

  const isAccessDenied = isUserLoaded && !isAdmin;
  useEffect(() => {
    if (isAccessDenied) {
      void router.replace(`/site/${siteUUID}`);
    }
  }, [isAccessDenied, router, siteUUID]);

  if (!isUserLoaded || isAccessDenied) return null;

  return (
    <SitePageProviders frameworkKey={site?.frameworkKey} isLoaded={isLoaded}>
      {site == null ? null : <AdminSitePolygonReviewShell site={site} />}
    </SitePageProviders>
  );
};

export default SitePolygonReviewPage;
