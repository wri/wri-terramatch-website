import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactElement, useCallback, useMemo, useState } from "react";

import EntityGalleryTab from "@/components/extensive/EntityGallery/EntityGalleryTab";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import Loader from "@/components/generic/Loading/Loader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useProjectAnomalies } from "@/components/projectData/anomalies/useProjectAnomalies";
import { useFullProject } from "@/connections/Entity";
import FrameworkProvider, { shouldHideNurseries, useFrameworkContext } from "@/context/framework.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useValueChanged } from "@/hooks/useValueChanged";
import ProjectDetailTab from "@/pages/project/[uuid]/tabs/Details";
import ProjectOverviewTab from "@/pages/project/[uuid]/tabs/Overview";
import ProjectNurseriesTab from "@/pages/project/[uuid]/tabs/ProjectNurseries";
import ProjectSitesTab from "@/pages/project/[uuid]/tabs/ProjectSites";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ProjectBanner from "@/redesignComponents/content/Banner/ProjectBanner/ProjectBanner";
import { ProjectIcon } from "@/redesignComponents/foundations/Icons";
import ResponsiveTypography from "@/styles/ResponsiveTypography";

import InviteMonitoringPartnerModal from "./components/InviteMonitoringPartnerModal";
import AuditLog from "./tabs/AuditLog";
import GoalsAndProgressTab from "./tabs/GoalsAndProgress";
import ProgressReportTab from "./tabs/ProgressReport";
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

const SUFFIX_VIEW_KEYS = ["reporting-tasks", "sites", "nurseries"];

const ProjectContent: FC<ProjectContentProps> = ({ project, refetch }) => {
  const t = useT();
  const router = useRouter();
  const { framework } = useFrameworkContext();
  const [showInviteModal, setShowInviteModal] = useState(false);

  // Project-wide anomaly count for the "Project Details and Data" tab badge. Folds geometry
  // validation together with the watchlist checks — one merged flag, per the product decision.
  const { totalCount: anomalyCount } = useProjectAnomalies(project.uuid, project);

  const currentTab = (router.query.tab as string) ?? "overview";
  const isSuffix = SUFFIX_VIEW_KEYS.includes(currentTab);
  const activeSuffixView = isSuffix ? currentTab : null;
  const activeTab = isSuffix ? "overview" : currentTab;

  const navigateToTab = useCallback(
    (tab: string) => {
      router.push(`/project/${project.uuid}?tab=${tab}`, undefined, { shallow: true });
    },
    [router, project.uuid]
  );

  const tabItems = useMemo<TabItem[]>(
    () => [
      {
        key: "overview",
        title: t("Overview"),
        body: <ProjectOverviewTab project={project} onViewSites={() => navigateToTab("sites")} />
      },
      { key: "details", title: t("Data"), body: <ProjectDetailTab project={project} /> },
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
      { key: "team-members", title: t("Team Members"), body: <TeamMembersTab project={project} /> },
      {
        key: "audit-log",
        title: t("Audit Log"),
        body: <AuditLog project={project} refresh={refetch} />
      }
    ],
    [project, t, refetch, navigateToTab]
  );

  const tabBarTabs = useMemo(
    () =>
      tabItems.map(item => ({
        value: item.key,
        // The design-system tab label is string-only, so the anomaly flag rides on the label text:
        // a ⚑ and the count appended to the Data tab when anything is flagged.
        label: item.key === "details" && anomalyCount > 0 ? `${item.title}  ⚑ ${anomalyCount}` : item.title
      })),
    [tabItems, anomalyCount]
  );

  const hideNurseries = shouldHideNurseries(framework);

  const suffixViewContent = useMemo(() => {
    if (!activeSuffixView) return null;

    const viewMap: Record<string, ReactElement> = {
      "reporting-tasks": <ProgressReportTab projectUUID={project.uuid} />,
      sites: <ProjectSitesTab project={project} />,
      nurseries: <ProjectNurseriesTab project={project} />
    };

    return viewMap[activeSuffixView] || null;
  }, [activeSuffixView, project]);

  const suffixButtons: SuffixButtonConfig[] = useMemo(
    () => [
      { key: "reporting-tasks", labelKey: "Reports" },
      { key: "sites", labelKey: "Sites" },
      ...(hideNurseries ? [] : [{ key: "nurseries", labelKey: "Nurseries" }])
    ],
    [hideNurseries]
  );

  const tabBarDefaultValue = activeSuffixView != null ? "__none__" : activeTab;

  const handleInvite = () => setShowInviteModal(true);

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
          { label: project?.name ?? "", link: `/project/${project?.uuid}` },
          ...(activeSuffixView
            ? [
                {
                  label: t(activeSuffixView === "reporting-tasks" ? "Reports" : activeSuffixView),
                  link: `/project/${project?.uuid}?tab=${activeSuffixView}`
                }
              ]
            : [])
        ]}
        suffix={
          <div className="flex gap-1.5">
            {suffixButtons.map((button, index) => (
              <div key={button.key} className="flex gap-1.5">
                {index > 0 && <span className="text-sm text-theme-neutral-300">|</span>}
                <Button
                  variant="borderless"
                  size="small"
                  className={`underline underline-offset-2 ${activeSuffixView === button.key ? "font-semibold" : ""}`}
                  onClick={() => {
                    navigateToTab(button.key);
                  }}
                >
                  {t(button.labelKey)}
                </Button>
              </div>
            ))}
          </div>
        }
        toolbar={{
          tabBar: {
            tabs: tabBarTabs,
            defaultValue: tabBarDefaultValue,
            onTabClick: (tabValue: string) => {
              navigateToTab(tabValue);
            }
          }
        }}
      />
      <div className="flex flex-1">{suffixViewContent ?? tabItems.find(item => item.key === activeTab)?.body}</div>
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
