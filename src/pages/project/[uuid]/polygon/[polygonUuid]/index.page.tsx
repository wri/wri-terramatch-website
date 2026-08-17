import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import PolygonDetailView from "@/components/projectData/PolygonDetailView";
import FrameworkProvider from "@/context/framework.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

/**
 * Single-polygon entity page: Project -> Site -> Polygon drill-down destination.
 *
 * Both ids come off the router — `uuid` is the project, `polygonUuid` is the site-polygon. The
 * page wraps the view in the same providers the project page uses so descendants that reach for
 * framework or map-area context behave identically to the rest of the project experience.
 */
const PolygonDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const projectUuid = router.query.uuid as string;
  const polygonUuid = router.query.polygonUuid as string;

  return (
    <MapAreaProvider>
      <FrameworkProvider>
        <ResponsiveTypography />
        <Head>
          <title>{t("Polygon")}</title>
        </Head>
        <div className="flex flex-1">
          {projectUuid == null || polygonUuid == null ? null : (
            <PolygonDetailView projectUuid={projectUuid} polygonUuid={polygonUuid} />
          )}
        </div>
        <PageFooter />
      </FrameworkProvider>
    </MapAreaProvider>
  );
};

export default PolygonDetailPage;
