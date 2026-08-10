import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullNursery, useFullProject, useFullSite } from "@/connections/Entity";
import FrameworkProvider from "@/context/framework.provider";

import ReportsIndexHeader from "./components/ReportsIndexHeader";
import { isReportsIndexSource } from "./reportIndex.utils";

const ReportsIndexPage = () => {
  const router = useRouter();
  const t = useT();
  const [activeTab, setActiveTab] = useState("progress-reports");
  const sourceParam = typeof router.query.source === "string" ? router.query.source : undefined;
  const source = isReportsIndexSource(sourceParam) ? sourceParam : undefined;
  const sourceUuid = typeof router.query.uuid === "string" ? router.query.uuid : undefined;

  const [siteLoaded, { data: site }] = useFullSite({
    id: source === "site" ? sourceUuid : undefined
  });
  const [nurseryLoaded, { data: nursery }] = useFullNursery({
    id: source === "nursery" ? sourceUuid : undefined
  });

  const projectUuid =
    (source === "project" ? sourceUuid : source === "site" ? site?.projectUuid : nursery?.projectUuid) ?? undefined;
  const [projectLoaded, { data: project }] = useFullProject({ id: projectUuid });

  const sourceLoaded = source === "project" ? projectLoaded : source === "site" ? siteLoaded : nurseryLoaded;
  const sourceEntity = source === "project" ? project : source === "site" ? site : nursery;
  const loading =
    !router.isReady ||
    (source != null && sourceUuid != null && (!sourceLoaded || (projectUuid != null && !projectLoaded)));

  if (router.isReady && (source == null || sourceUuid == null)) {
    return <Box>{t("The reports link is invalid.")}</Box>;
  }

  const selectedViewLabel =
    source === "project" ? project?.name ?? t("Project") : sourceEntity?.name ?? project?.name ?? "";

  return (
    <FrameworkProvider frameworkKey={project?.frameworkKey}>
      <Head>
        <title>{t("Reports")}</title>
      </Head>
      <LoadingContainer loading={loading}>
        {project == null || source == null || sourceEntity == null ? (
          <Box>{t("The reports information could not be found.")}</Box>
        ) : (
          <ReportsIndexHeader activeTab={activeTab} selectedViewLabel={selectedViewLabel} onTabChange={setActiveTab} />
        )}
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default ReportsIndexPage;
