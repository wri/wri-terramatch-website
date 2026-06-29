import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Loader from "@/components/generic/Loading/Loader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullSite } from "@/connections/Entity";
import { useMyUser } from "@/connections/User";
import FrameworkProvider from "@/context/framework.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useValueChanged } from "@/hooks/useValueChanged";
import ProjectResponsiveTypography from "@/styles/ResponsiveTypography";
import Log from "@/utils/log";

import AdminSitePolygonReviewShell from "./sitePolygonReview/AdminSitePolygonReviewShell";

const SitePolygonReviewPage = () => {
  const t = useT();
  const router = useRouter();
  const { loading } = useLoading();
  const siteUUID = router.query.uuid as string;

  const [isUserLoaded, { isAdmin }] = useMyUser();
  const [isLoaded, { data: site, loadFailure }] = useFullSite({ id: siteUUID });
  const { openToast } = useToastContext();

  useValueChanged(isLoaded, () => {
    if (isLoaded && site == null) {
      Log.error("Site not found", { siteUUID, loadFailure });
      openToast(t("Site not found"), ToastType.ERROR);
    }
  });

  const isAccessDenied = isUserLoaded && !isAdmin;
  useEffect(() => {
    if (isAccessDenied) {
      void router.replace(`/site/${siteUUID}`);
    }
  }, [isAccessDenied, router, siteUUID]);

  if (!isUserLoaded || isAccessDenied) return null;

  return (
    <MapAreaProvider>
      <ProjectResponsiveTypography />
      <FrameworkProvider frameworkKey={site?.frameworkKey}>
        {loading && (
          <div className="fixed top-0 z-50 flex h-screen w-screen items-center justify-center backdrop-brightness-50">
            <Loader />
          </div>
        )}
        <LoadingContainer loading={!isLoaded}>{site == null ? null : <AdminSitePolygonReviewShell />}</LoadingContainer>
      </FrameworkProvider>
    </MapAreaProvider>
  );
};

export default SitePolygonReviewPage;
