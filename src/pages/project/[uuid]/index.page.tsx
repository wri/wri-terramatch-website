import { useT } from "@transifex/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, forwardRef, ReactElement, useEffect, useMemo, useState } from "react";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import EntityStatusBar from "@/components/extensive/EntityStatusBar";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import Loader from "@/components/generic/Loading/Loader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullProject } from "@/connections/Entity";
import { useGadmOptions } from "@/connections/Gadm";
import FrameworkProvider, { Framework, useFrameworkContext } from "@/context/framework.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import { GetV2ProjectsUUIDPartnersResponse, useGetV2ProjectsUUIDPartners } from "@/generated/apiComponents";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import ProjectHeader from "@/pages/project/[uuid]/components/ProjectHeader";
import ProjectDetailTab from "@/pages/project/[uuid]/tabs/Details";
import GalleryTab from "@/pages/project/[uuid]/tabs/Gallery";
import ProjectOverviewTab from "@/pages/project/[uuid]/tabs/Overview";
import ProjectNurseriesTab from "@/pages/project/[uuid]/tabs/ProjectNurseries";
import ProjectSitesTab from "@/pages/project/[uuid]/tabs/ProjectSites";
import ProjectBanner from "@/redesignComponents/content/Banner/ProjectBanner";
import { formatOptionsList } from "@/utils/options";

import AuditLog from "./tabs/AuditLog";
import GoalsAndProgressTab from "./tabs/GoalsAndProgress";
import ProgressReportTab from "./tabs/ProgressReport";

// Adapter component to make Next.js Link compatible with WRI design system breadcrumbs
// The design system expects a Link component with a 'to' prop (React Router style),
// but Next.js Link uses 'href', so we adapt it here.
const NextLinkAdapter = forwardRef<HTMLAnchorElement, { to: string; children: React.ReactNode; className?: string }>(
  ({ to, children, className, ...props }, ref) => {
    return (
      <Link href={to} ref={ref} className={className} {...props}>
        {children}
      </Link>
    );
  }
);
NextLinkAdapter.displayName = "NextLinkAdapter";

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
const ProjectContent: FC<ProjectContentProps> = ({ project, refetch }) => {
  const t = useT();
  const router = useRouter();
  const { framework } = useFrameworkContext();
  const countryOptions = useGadmOptions({ level: 0 });

  // Get initial tab from query or default to "overview"
  const initialTab = (router.query.tab as string) || "overview";
  const [activeTab, setActiveTab] = useState(initialTab);

  console.log(project);
  function countryCodeToFlag(code: string) {
    return code
      .slice(0, 2) // BRA -> BR
      .toUpperCase()
      .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)));
  }

  const { data: partners } = useGetV2ProjectsUUIDPartners<{ data: GetV2ProjectsUUIDPartnersResponse }>({
    pathParams: { uuid: project.uuid }
  });

  console.log(partners, "PARTNERS");

  // Define all tab items
  const allTabItems = useMemo<TabItem[]>(
    () => [
      { key: "overview", title: t("Overview"), body: <ProjectOverviewTab project={project} /> },
      { key: "details", title: t("Details"), body: <ProjectDetailTab project={project} /> },
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
      {
        key: "nurseries",
        title: t("Nurseries"),
        body: <ProjectNurseriesTab project={project} />,
        hide: [Framework.PPC]
      },
      {
        key: "reporting-tasks",
        title: t("Reporting Tasks"),
        body: <ProgressReportTab projectUUID={project.uuid} />
      },
      {
        key: "audit-log",
        title: t("Audit Log"),
        body: <AuditLog project={project} refresh={refetch} />
      }
    ],
    [project, refetch, t]
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

  // Ensure active tab is valid after filtering
  useEffect(() => {
    const isValidTab = filteredTabItems.some(item => item.key === activeTab);
    if (!isValidTab && filteredTabItems.length > 0) {
      setActiveTab(filteredTabItems[0].key);
    }
  }, [filteredTabItems, activeTab]);

  // Sync with router query
  useEffect(() => {
    const queryTab = router.query.tab as string;
    if (queryTab && queryTab !== activeTab) {
      const isValidTab = filteredTabItems.some(item => item.key === queryTab);
      if (isValidTab) {
        setActiveTab(queryTab);
      }
    }
  }, [router.query.tab, filteredTabItems, activeTab]);

  // Get active tab content
  const activeTabContent = useMemo(
    () => filteredTabItems.find(item => item.key === activeTab)?.body,
    [filteredTabItems, activeTab]
  );

  // Handle tab click
  const handleTabClick = (tabValue: string) => {
    setActiveTab(tabValue);
    router.query.tab = tabValue;
    router.push(router, undefined, { shallow: true });
  };

  return (
    <>
      <Head>
        <title>{t("Project")}</title>
      </Head>
      <ProjectBanner
        project={project}
        breadcrumbs={{
          links: [
            { label: t("My Projects"), link: "/" },
            { label: project?.name ?? "", link: `/project/${project?.uuid}` }
          ],
          linkRouter: NextLinkAdapter,
          size: "default"
        }}
        slots={[{ title: t("Overview"), description: "overview" }]}
        title={project?.name ?? ""}
        description={project.description}
        tag={{ state: "not-started" }}
        organization={project.organisationName ?? ""}
        startDate="Jan 2024"
        endDate="Dec 2026"
        country={formatOptionsList(countryOptions ?? [], project.country ?? [])}
        countryFlag={countryCodeToFlag(project.country ?? "")}
        team={
          partners?.data.slice(0, 5).map(partner => ({
            name: `${partner.first_name ?? ""} ${partner.last_name ?? ""}`.trim(),
            avatar: {
              name: `${partner.first_name ?? ""} ${partner.last_name ?? ""}`.trim()
            }
          })) ?? []
        }
        toolbar={{
          tabBar: {
            tabs: tabBarTabs,
            defaultValue: activeTab,
            onTabClick: handleTabClick
          }
        }}
      />
      {/* <PageBreadcrumbs links={[{ title: t("My Projects"), path: "/my-projects" }, { title: project?.name ?? "" }]} /> */}
      <ProjectHeader {...{ project }} />
      <EntityStatusBar entityName="projects" entity={project} />
      <div className="w-full max-w-[82vw] px-10 xl:px-0">{activeTabContent}</div>
      <SecondaryTabs
        tabItems={[
          { key: "overview", title: t("Overview"), body: <ProjectOverviewTab project={project} /> },
          { key: "details", title: t("Details"), body: <ProjectDetailTab project={project} /> },
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
          {
            key: "nurseries",
            title: t("Nurseries"),
            body: <ProjectNurseriesTab project={project} />,
            hide: [Framework.PPC]
          },
          {
            key: "reporting-tasks",
            title: t("Reporting Tasks"),
            body: <ProgressReportTab projectUUID={project.uuid} />
          },
          {
            key: "audit-log",
            title: t("Audit Log"),
            body: <AuditLog project={project} refresh={refetch} />
          }
        ]}
        containerClassName="max-w-[82vw] px-10 xl:px-0 w-full"
      />
      <PageFooter />
    </>
  );
};

const ProjectDetailPage = () => {
  const router = useRouter();
  const { loading } = useLoading();
  const projectUUID = router.query.uuid as string;

  const [isLoaded, { data: project, refetch }] = useFullProject({ id: projectUUID });

  return (
    (!isLoaded || project != null) && (
      <MapAreaProvider>
        <FrameworkProvider frameworkKey={project?.frameworkKey}>
          {loading && (
            <div className="fixed top-0 z-50 flex h-screen w-screen items-center justify-center backdrop-brightness-50">
              <Loader />
            </div>
          )}
          <LoadingContainer loading={!isLoaded}>
            {project && <ProjectContent {...{ project, refetch }} />}
          </LoadingContainer>
        </FrameworkProvider>
      </MapAreaProvider>
    )
  );
};

export default ProjectDetailPage;
