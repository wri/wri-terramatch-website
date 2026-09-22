import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { isString } from "lodash";
import Head from "next/head";
import { useRouter } from "next/router";
import { useRef } from "react";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useLightNursery, useLightProject, useLightSite } from "@/connections/Entity";
import FrameworkProvider from "@/context/framework.provider";
import { ReportsProvider } from "@/context/reports.provider";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import ReportsIndexContent from "./components/ReportsIndexContent";
import { ReportsIndexSourceEntity } from "./reportIndex.types";
import { isReportsIndexSource, ReportsIndexSource } from "./reportIndex.utils";
import ReportsSelectionProvider from "./ReportsSelection.provider";

const ReportsIndexPage = () => {
  const router = useRouter();
  const t = useT();
  const sourceParam = isString(router.query.source) ? router.query.source : undefined;
  const source = isReportsIndexSource(sourceParam) ? sourceParam : undefined;
  const sourceUuid = isString(router.query.uuid) ? router.query.uuid : undefined;

  const [siteLoaded, { data: site }] = useLightSite({
    id: source === "site" ? sourceUuid : undefined,
    enabled: source === "site"
  });
  const [nurseryLoaded, { data: nursery }] = useLightNursery({
    id: source === "nursery" ? sourceUuid : undefined,
    enabled: source === "nursery"
  });

  const projectUuid =
    (source === "project" ? sourceUuid : source === "site" ? site?.projectUuid : nursery?.projectUuid) ?? undefined;
  const [projectLoaded, { data: project }] = useLightProject({ id: projectUuid });
  // Keep the last loaded project so switching View does not unmount the page shell.
  const displayedProjectRef = useRef(project);
  if (project != null) displayedProjectRef.current = project;
  const displayedProject = project ?? displayedProjectRef.current;

  const sourceLoaded = source === "project" ? projectLoaded : source === "site" ? siteLoaded : nurseryLoaded;
  const sourceEntity = source === "project" ? displayedProject : source === "site" ? site : nursery;
  const loading =
    !router.isReady ||
    (displayedProject == null &&
      source != null &&
      sourceUuid != null &&
      (!sourceLoaded || (projectUuid != null && !projectLoaded)));

  if (router.isReady && (source == null || sourceUuid == null)) {
    return <Box>{t("The reports link is invalid.")}</Box>;
  }

  return (
    <FrameworkProvider frameworkKey={displayedProject?.frameworkKey}>
      <ReportsProvider>
        <ResponsiveTypography />
        <Head>
          <title>{t("Reports")}</title>
        </Head>
        <LoadingContainer loading={loading}>
          {displayedProject == null ? (
            <Box>{t("The reports information could not be found.")}</Box>
          ) : (
            <ReportsSelectionProvider key={`${source}:${sourceEntity?.uuid}`}>
              <ReportsIndexContent
                project={displayedProject}
                source={source as ReportsIndexSource}
                sourceEntity={sourceEntity as ReportsIndexSourceEntity}
              />
            </ReportsSelectionProvider>
          )}
        </LoadingContainer>
      </ReportsProvider>
    </FrameworkProvider>
  );
};

export default ReportsIndexPage;
