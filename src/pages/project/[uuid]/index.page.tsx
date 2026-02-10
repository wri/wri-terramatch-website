import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC, ReactElement, useCallback, useEffect, useMemo, useState } from "react";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import Loader from "@/components/generic/Loading/Loader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullProject } from "@/connections/Entity";
import FrameworkProvider, { Framework, useFrameworkContext } from "@/context/framework.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import BuildTeamMembersPage from "@/pages/build-team-members/index.page";
import ProjectDetailTab from "@/pages/project/[uuid]/tabs/Details";
import GalleryTab from "@/pages/project/[uuid]/tabs/Gallery";
import ProjectOverviewTab from "@/pages/project/[uuid]/tabs/Overview";
import ProjectNurseriesTab from "@/pages/project/[uuid]/tabs/ProjectNurseries";
import ProjectSitesTab from "@/pages/project/[uuid]/tabs/ProjectSites";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ProjectBanner from "@/redesignComponents/content/Banner/ProjectBanner";
import { Project } from "@/redesignComponents/foundations/Icons";

import AuditLog from "./tabs/AuditLog";
import GoalsAndProgressTab from "./tabs/GoalsAndProgress";
import ProgressReportTab from "./tabs/ProgressReport";

// Types
type TabItem = {
  key: string;
  title: string;
  body: ReactElement;
  show?: Framework[];
  hide?: Framework[];
};

type ProjectContentProps = {
  project: ProjectFullDto;
  refetch: () => void;
};

type SuffixButtonConfig = {
  key: string;
  labelKey: string;
};
const ProjectContent: FC<ProjectContentProps> = ({ project, refetch }) => {
  const t = useT();
  const router = useRouter();
  const { framework } = useFrameworkContext();

  const initialTab = (router.query.tab as string) || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeSuffixView, setActiveSuffixView] = useState<string | null>(null);
  // Define all tab items
  const allTabItems = useMemo<TabItem[]>(
    () => [
      { key: "overview", title: t("Overview"), body: <ProjectOverviewTab project={project} /> },
      { key: "details", title: t("Project Details"), body: <ProjectDetailTab project={project} /> },
      {
        key: "gallery",
        title: t("Gallery"),
        body: (
          <GalleryTab
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
      { key: "sites", title: t("Sites"), body: <ProjectSitesTab project={project} /> },
      { key: "team-members", title: t("Team Members"), body: <BuildTeamMembersPage project={project} /> },
      {
        key: "audit-log",
        title: t("Audit Log"),
        body: <AuditLog project={project} refresh={refetch} />
      }
    ],
    [project, t, refetch]
  );

  // Filter tabs based on framework
  const filteredTabItems = useMemo(
    () =>
      allTabItems.filter(item => {
        if (item.show != null) {
          return item.show.includes(framework);
        } else if (item.hide != null) {
          return !item.hide.includes(framework);
        }
        return true;
      }),
    [allTabItems, framework]
  );

  // Map to TabBar format
  const tabBarTabs = useMemo(
    () =>
      filteredTabItems.map(item => ({
        value: item.key,
        label: item.title
      })),
    [filteredTabItems]
  );

  // Sync tab state with router query and validate against filtered tabs
  useEffect(() => {
    const queryTab = router.query.tab as string;
    const isValidTab = (tab: string) => filteredTabItems.some(item => item.key === tab);

    if (queryTab && queryTab !== activeTab && isValidTab(queryTab)) {
      setActiveTab(queryTab);
    } else if (!isValidTab(activeTab) && filteredTabItems.length > 0) {
      setActiveTab(filteredTabItems[0].key);
    }
  }, [router.query.tab, filteredTabItems, activeTab]);

  // Get active tab content
  const activeTabContent = useMemo(
    () => filteredTabItems.find(item => item.key === activeTab)?.body,
    [filteredTabItems, activeTab]
  );

  const handleTabClick = useCallback(
    (tabValue: string) => {
      setActiveTab(tabValue);
      setActiveSuffixView(null);
      router.query.tab = tabValue;
      router.push(router, undefined, { shallow: true });
    },
    [router]
  );

  const handleSuffixButtonClick = useCallback((viewKey: string) => {
    setActiveSuffixView(prev => (prev === viewKey ? null : viewKey));
  }, []);

  const shouldHideNurseries = framework === Framework.PPC;

  const suffixViewContent = useMemo(() => {
    if (!activeSuffixView) return null;

    const viewMap: Record<string, ReactElement> = {
      reports: <ProgressReportTab projectUUID={project.uuid} />,
      sites: <ProjectSitesTab project={project} />,
      nurseries: <ProjectNurseriesTab project={project} />
    };

    return viewMap[activeSuffixView] || null;
  }, [activeSuffixView, project]);

  const suffixButtons: SuffixButtonConfig[] = useMemo(
    () => [
      { key: "reports", labelKey: "Reports" },
      { key: "sites", labelKey: "Sites" },
      ...(shouldHideNurseries ? [] : [{ key: "nurseries", labelKey: "Nurseries" }])
    ],
    [shouldHideNurseries]
  );

  return (
    <>
      <Head>
        <title>{t("Project")}</title>
      </Head>
      <ProjectBanner
        className="top-[70px]"
        project={project}
        breadcrumbs={[
          { label: t("Projects"), link: "/my-projects", icon: <Project className="!text-theme-primary-900" /> },
          { label: project?.name ?? "", link: `/project/${project?.uuid}` }
        ]}
        suffix={
          <div className="flex gap-1.5">
            {suffixButtons.map((button, index) => (
              <div key={button.key} className="flex gap-1.5">
                {index > 0 && <span className="text-theme-neutral-300 text-sm">|</span>}
                <Button
                  variant="borderless"
                  size="small"
                  className={`underline underline-offset-2 ${activeSuffixView === button.key ? "font-semibold" : ""}`}
                  onClick={() => handleSuffixButtonClick(button.key)}
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
            defaultValue: activeTab,
            onTabClick: handleTabClick
          }
        }}
      />
      <div className="w-full">{activeSuffixView ? suffixViewContent : activeTabContent}</div>
      <PageFooter />
    </>
  );
};

const ProjectDetailPage = () => {
  const router = useRouter();
  const { loading } = useLoading();
  const projectUUID = router.query.uuid as string;
  const [isLoaded, { data: project, refetch }] = useFullProject({ id: projectUUID });

  if (!isLoaded || project == null) {
    return null;
  }

  return (
    <MapAreaProvider>
      <FrameworkProvider frameworkKey={project.frameworkKey}>
        {loading && (
          <div className="fixed top-0 z-50 flex h-screen w-screen items-center justify-center backdrop-brightness-50">
            <Loader />
          </div>
        )}
        <LoadingContainer loading={!isLoaded}>
          <ProjectContent project={project} refetch={refetch} />
        </LoadingContainer>
      </FrameworkProvider>
    </MapAreaProvider>
  );
};

export default ProjectDetailPage;
