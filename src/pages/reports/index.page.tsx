import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useRef } from "react";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useLightNursery, useLightProject, useLightSite } from "@/connections/Entity";
import FrameworkProvider from "@/context/framework.provider";
import { ReportsProvider } from "@/context/reports.provider";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import ReportsIndexContent from "./components/ReportsIndexContent";
import { isReportsIndexSource } from "./reportIndex.utils";
import ReportsSelectionProvider from "./ReportsSelection.provider";

const ReportsIndexPage: FC = () => {
  const router = useRouter();
  const t = useT();
  const sourceParam = typeof router.query.source === "string" ? router.query.source : undefined;
  const source = isReportsIndexSource(sourceParam) ? sourceParam : undefined;
  const sourceUuid = typeof router.query.uuid === "string" ? router.query.uuid : undefined;

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
    return (
      <Text textStyle="400" color="neutral.900">
        {t("The reports link is invalid.")}
      </Text>
    );
  }

  return (
    <FrameworkProvider frameworkKey={displayedProject?.frameworkKey}>
      <ReportsProvider>
        <ResponsiveTypography />
        <Head>
          <title>{t("Reports")}</title>
        </Head>
        <LoadingContainer loading={loading}>
          {displayedProject == null || source == null || sourceEntity == null ? (
            <Text textStyle="400" color="neutral.900">
              {t("The reports information could not be found.")}
            </Text>
          ) : (
            <ReportsSelectionProvider key={`${source}:${sourceEntity.uuid}`}>
              <ReportsIndexContent project={displayedProject} source={source} sourceEntity={sourceEntity} />
            </ReportsSelectionProvider>
          )}
        </LoadingContainer>
      </ReportsProvider>
    </FrameworkProvider>
  );
};

export default ReportsIndexPage;
