import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, useEffect } from "react";

import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useLightProject, useProjectIndex } from "@/connections/Entity";
import FrameworkProvider from "@/context/framework.provider";
import { ReportsProvider } from "@/context/reports.provider";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import ReportsIndexContent from "./components/ReportsIndexContent";
import { ALL_PROJECTS_VIEW_VALUE } from "./reportIndex.utils";
import ReportsSelectionProvider from "./ReportsSelection.provider";

const ReportsIndexPage: FC = () => {
  const router = useRouter();
  const t = useT();
  const sourceUuid = typeof router.query.uuid === "string" ? router.query.uuid : undefined;

  useEffect(() => {
    if (router.isReady && sourceUuid == null && router.query.view == null) {
      void router.replace(`/reports?view=${ALL_PROJECTS_VIEW_VALUE}`, undefined, { shallow: true });
    }
  }, [router, sourceUuid]);

  const [projectsLoaded, { data: projects }] = useProjectIndex({});
  const [projectLoaded, { data: project }] = useLightProject({ id: sourceUuid, enabled: sourceUuid != null });

  const finalProject = sourceUuid == null ? projects?.[0] ?? null : project;
  const loading = !router.isReady || (finalProject == null && (sourceUuid == null ? !projectsLoaded : !projectLoaded));

  return (
    <FrameworkProvider frameworkKey={finalProject?.frameworkKey}>
      <ReportsProvider>
        <ResponsiveTypography />
        <Head>
          <title>{t("Reports")}</title>
        </Head>
        <LoadingContainer loading={loading}>
          {finalProject == null ? null : (
            <ReportsSelectionProvider key={`project:${finalProject.uuid}`}>
              <ReportsIndexContent project={finalProject} />
            </ReportsSelectionProvider>
          )}
        </LoadingContainer>
      </ReportsProvider>
    </FrameworkProvider>
  );
};

export default ReportsIndexPage;
