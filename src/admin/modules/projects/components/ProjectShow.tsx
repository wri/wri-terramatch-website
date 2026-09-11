import { FC, useCallback, useEffect } from "react";
import { Show, TabbedShowLayout, usePrevious, useRecordContext, useRefresh } from "react-admin";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AuditLogTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogTab";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import DocumentTab from "@/admin/components/ResourceTabs/DocumentTab/DocumentTab";
import GalleryTab from "@/admin/components/ResourceTabs/GalleryTab/GalleryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import MonitoredTab from "@/admin/components/ResourceTabs/MonitoredTab/MonitoredTab";
import ReportTab from "@/admin/components/ResourceTabs/ReportTab/ReportTab";
import PolygonReviewLauncher from "@/admin/sitePolygonReview/PolygonReviewLauncher";
import { useFullProject } from "@/connections/Entity";
import { RecordFrameworkProvider } from "@/context/framework.provider";

const ProjectShowActions: FC = () => {
  const record = useRecordContext();
  if (!record) return null;
  const { uuid, isTest } = record;
  const [, { isUpdating, update }] = useFullProject({ id: uuid });
  const refresh = useRefresh();
  const wasUpdating = usePrevious(isUpdating);

  if (wasUpdating && !isUpdating) refresh();

  const toggleTestStatus = useCallback(() => update({ isTest: !isTest }), [isTest, update]);

  return <ShowActions resourceName="project" toggleTestStatus={toggleTestStatus} />;
};

const ProjectShow = () => {
  // MUI Tabs measures the active-tab underline on mount, before the bold tab webfont has finished
  // loading, so on first load the indicator renders too short / off-center under "Project
  // Information" until something triggers a recalc. MUI recalculates the indicator on window resize,
  // so nudge one after first paint and again once web fonts are ready.
  useEffect(() => {
    const recalcTabIndicator = () => window.dispatchEvent(new Event("resize"));
    const raf = requestAnimationFrame(recalcTabIndicator);
    let cancelled = false;
    if (typeof document !== "undefined" && document.fonts?.ready != null) {
      document.fonts.ready.then(() => !cancelled && recalcTabIndicator()).catch(() => undefined);
    }
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Show actions={<ProjectShowActions />} className="-mt-[50px] bg-neutral-100">
      <RecordFrameworkProvider>
        <TabbedShowLayout>
          <InformationTab type="projects" />
          <TabbedShowLayout.Tab label="Polygons">
            <PolygonReviewLauncher entity="project" />
          </TabbedShowLayout.Tab>
          <ReportTab label="Project Progress" type="projects" />
          <GalleryTab label="Project Gallery" entity="projects" />
          <DocumentTab label="Project Documents" entity="projects" />
          <ChangeRequestsTab entity="projects" singularEntity="project" />
          <MonitoredTab label="Monitored Data" type={"projects"}></MonitoredTab>
          <AuditLogTab entity={AuditLogButtonStates.PROJECT} />
        </TabbedShowLayout>
      </RecordFrameworkProvider>
    </Show>
  );
};

export default ProjectShow;
