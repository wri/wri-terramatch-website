import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC, useEffect, useState } from "react";

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

  const [initialUrlChecked, setInitialUrlChecked] = useState(false);
  useEffect(() => {
    if (!router.isReady || initialUrlChecked) return;
    setInitialUrlChecked(true);
    if (sourceUuid == null && router.query.view == null) {
      void router.replace(`/reports?view=${ALL_PROJECTS_VIEW_VALUE}`, undefined, { shallow: true });
    }
  }, [initialUrlChecked, router, sourceUuid]);

  const [projectsLoaded, { data: projects }] = useProjectIndex({});
  const [projectLoaded, { data: project }] = useLightProject({ id: sourceUuid, enabled: sourceUuid != null });

  const loadedProject = sourceUuid == null ? projects?.[0] ?? null : project;
  const [lastProject, setLastProject] = useState(loadedProject);
  if (loadedProject != null && loadedProject !== lastProject) {
    setLastProject(loadedProject);
  }
  const finalProject = loadedProject ?? (sourceUuid != null && !projectLoaded ? lastProject : null);
  const loading = !router.isReady || (finalProject == null && (sourceUuid == null ? !projectsLoaded : !projectLoaded));

  return (
    <FrameworkProvider frameworkKey={finalProject?.frameworkKey}>
      <ReportsProvider>
        <ResponsiveTypography />
        <title>{t("Reports")}</title>
        <LoadingContainer loading={loading}>
          {finalProject == null ? null : (
            <ReportsSelectionProvider>
              <ReportsIndexContent project={finalProject} />
            </ReportsSelectionProvider>
          )}
        </LoadingContainer>
      </ReportsProvider>
    </FrameworkProvider>
  );
};

export default ReportsIndexPage;
