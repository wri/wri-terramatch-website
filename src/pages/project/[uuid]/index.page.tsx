import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactElement, useCallback, useMemo, useState } from "react";

import EntityGalleryTab from "@/components/extensive/EntityGallery/EntityGalleryTab";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import Loader from "@/components/generic/Loading/Loader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullProject } from "@/connections/Entity";
import FrameworkProvider, { shouldHideNurseries, useFrameworkContext } from "@/context/framework.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useValueChanged } from "@/hooks/useValueChanged";
import ProjectDetailTab from "@/pages/project/[uuid]/tabs/Details";
import ProjectOverviewTab from "@/pages/project/[uuid]/tabs/Overview";
import ProjectBanner from "@/redesignComponents/content/Banner/ProjectBanner/ProjectBanner";
import { ProjectIcon } from "@/redesignComponents/foundations/Icons";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import InviteMonitoringPartnerModal from "./components/InviteMonitoringPartnerModal";
import AuditLog from "./tabs/AuditLog";
import GoalsAndProgressTab from "./tabs/GoalsAndProgress";
import ProjectNurseriesTab from "./tabs/ProjectNurseries";
import ProjectSitesTab from "./tabs/ProjectSites";
import ReportsTab from "./tabs/Reports";
import TeamMembersTab from "./tabs/TeamMembers";

type TabItem = {
  key: string;
  title: string;
  body: ReactElement;
};

type ProjectContentProps = {
  project: ProjectFullDto;
  refetch: () => void;
};

export type SuffixButtonConfig = {
  key: string;
  labelKey: string;
};

const ProjectContent: FC<ProjectContentProps> = ({ project, refetch }) => {
  const t = useT();
  const router = useRouter();
  const { framework } = useFrameworkContext();
  const [showInviteModal, setShowInviteModal] = useState(false);

  const activeTab = (router.query.tab as string) ?? "overview";
  const hideNurseries = shouldHideNurseries(framework);

  const navigateToTab = useCallback(
    (tab: string) => {
      router.push(`/project/${project.uuid}?tab=${tab}`, undefined, { shallow: true });
    },
    [router, project.uuid]
  );

  const tabItems = useMemo<TabItem[]>(() => {
    const items: TabItem[] = [
      {
        key: "overview",
        title: t("Overview"),
        body: (
          <ProjectOverviewTab
            project={project}
            onViewSites={() => navigateToTab("sites")}
            onViewNurseries={() => navigateToTab("nurseries")}
          />
        )
      },
      { key: "details", title: t("Project Details"), body: <ProjectDetailTab project={project} /> },
      {
        key: "gallery",
        title: t("Gallery"),
        body: (
          <EntityGalleryTab
            modelName="projects"
            modelUUID={project.uuid}
            modelTitle={t("Project")}
            entityData={project}
            emptyStateContent={t(
              "Your gallery is currently empty. Add images by using the 'Edit' button on this project, or images added to your sites and reports will also automatically populate this gallery."
            )}
          />
        )
      },
      { key: "goals", title: t("Progress & Goals"), body: <GoalsAndProgressTab project={project} /> },
      { key: "reports", title: t("Reports"), body: <ReportsTab project={project} /> },
      { key: "sites", title: t("Sites"), body: <ProjectSitesTab project={project} /> },
      { key: "team-members", title: t("Team Members"), body: <TeamMembersTab project={project} /> },
      {
        key: "audit-log",
        title: t("History"),
        body: <AuditLog project={project} refresh={refetch} />
      }
    ];

    if (!hideNurseries) {
      const sitesIndex = items.findIndex(item => item.key === "sites");
      const nurseriesTab: TabItem = {
        key: "nurseries",
        title: t("Nurseries"),
        body: <ProjectNurseriesTab project={project} />
      };
      items.splice(sitesIndex + 1, 0, nurseriesTab);
    }

    return items;
  }, [hideNurseries, navigateToTab, project, refetch, t]);

  const tabBarTabs = useMemo(
    () =>
      tabItems.map(item => ({
        value: item.key,
        label: item.title
      })),
    [tabItems]
  );

  const handleInvite = () => setShowInviteModal(true);

  const handleTabClick = useCallback(
    (tabValue: string) => {
      navigateToTab(tabValue);
    },
    [navigateToTab]
  );

  return (
    <>
      <ResponsiveTypography />
      <InviteMonitoringPartnerModal
        projectUUID={project.uuid}
        open={showInviteModal}
        onClose={() => setShowInviteModal(false)}
      />
      <Head>
        <title>{t("Project")}</title>
      </Head>
      <ProjectBanner
        project={project}
        onAddTeamClick={handleInvite}
        gotoTeamMembers={() => navigateToTab("team-members")}
        breadcrumbs={[
          {
            label: t("Projects"),
            link: "/my-projects",
            icon: <ProjectIcon className="!text-theme-primary-900" />
          },
          { label: project?.name ?? "", link: `/project/${project?.uuid}` }
        ]}
        suffix={null}
        toolbar={{
          tabBar: {
            tabs: tabBarTabs,
            defaultValue: activeTab,
            onTabClick: handleTabClick
          }
        }}
      />
      <div className="flex w-full min-w-0 flex-1 flex-col">{tabItems.find(item => item.key === activeTab)?.body}</div>
      <PageFooter />
    </>
  );
};

const ProjectDetailPage = () => {
  const router = useRouter();
  const t = useT();
  const { loading } = useLoading();
  const projectUUID = router.query.uuid as string;
  const [isLoaded, { data: project, refetch }] = useFullProject({ id: projectUUID });

  useValueChanged(isLoaded, () => {
    if (isLoaded && project == null) {
      showToast({
        label: t("Project not found"),
        type: "error",
        id: "project-not-found",
        placement: "bottom",
        duration: 5000,
        maxWidth: "auto"
      });
    }
  });

  return (
    <MapAreaProvider>
      {/* Programme framework for descendants (e.g. ContextCondition in TeamSection logos, tab visibility). */}
      <FrameworkProvider frameworkKey={project?.frameworkKey}>
        {loading && (
          <div className="fixed top-0 z-50 flex h-screen w-screen items-center justify-center backdrop-brightness-50">
            <Loader />
          </div>
        )}
        <LoadingContainer loading={!isLoaded}>
          {project == null ? null : <ProjectContent project={project} refetch={refetch} />}
        </LoadingContainer>
      </FrameworkProvider>
    </MapAreaProvider>
  );
};

export default ProjectDetailPage;
