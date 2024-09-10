import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import Loader from "@/components/generic/Loading/Loader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import FrameworkProvider, { Framework } from "@/context/framework.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import {
  GetV2ReportingFrameworksUUIDResponse,
  useGetV2ProjectsUUID,
  useGetV2ReportingFrameworksUUID
} from "@/generated/apiComponents";
import ProjectHeader from "@/pages/project/[uuid]/components/ProjectHeader";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";
import ProjectDetailTab from "@/pages/project/[uuid]/tabs/Details";
import GalleryTab from "@/pages/project/[uuid]/tabs/Gallery";
import GoalsAndProgressTab from "@/pages/project/[uuid]/tabs/GoalsAndProgress";
import ProjectOverviewTab from "@/pages/project/[uuid]/tabs/Overview";
import ProjectNurseriesTab from "@/pages/project/[uuid]/tabs/ProjectNurseries";
import ProjectSitesTab from "@/pages/project/[uuid]/tabs/ProjectSites";
import ReportingTasksTab from "@/pages/project/[uuid]/tabs/ReportingTasks";

import AuditLog from "./tabs/AuditLog";

const ButtonStates = {
  PROJECTS: 0,
  SITE: 1,
  POLYGON: 2
};

const ProjectDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const { loading } = useLoading();
  const projectUUID = router.query.uuid as string;

  const { data, isLoading, refetch } = useGetV2ProjectsUUID({
    pathParams: { uuid: projectUUID }
  });

  const project = (data?.data || {}) as any;

  const { data: reportingFrameworkData } = useGetV2ReportingFrameworksUUID(
    { pathParams: { uuid: project.framework_uuid } },
    {
      enabled: !!project.framework_uuid
    }
  );
  //@ts-ignore
  const reportingFramework = (reportingFrameworkData?.data || {}) as GetV2ReportingFrameworksUUIDResponse;

  return (
    <MapAreaProvider>
      <FrameworkProvider frameworkKey={project.framework_key}>
        {loading && (
          <div className="fixed top-0 z-50 flex h-screen w-screen items-center justify-center backdrop-brightness-50">
            <Loader />
          </div>
        )}
        <LoadingContainer loading={isLoading}>
          <Head>
            <title>{t("Project")}</title>
          </Head>
          <PageBreadcrumbs links={[{ title: t("My Projects"), path: "/my-projects" }, { title: project.name }]} />
          <ProjectHeader project={project} frameworkName={reportingFramework.name} />
          <StatusBar entityName="projects" entity={project} />
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
                    boundaryGeojson={project.boundary_geojson}
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
                body: <ReportingTasksTab projectUUID={project.uuid} />
              },
              {
                key: "audit-log",
                title: t("Audit Log"),
                body: <AuditLog project={project} refresh={refetch} enableChangeStatus={ButtonStates.POLYGON} />
              }
            ]}
            containerClassName="max-w-[82vw] px-10 xl:px-0 w-full"
          />
          <PageFooter />
        </LoadingContainer>
      </FrameworkProvider>
    </MapAreaProvider>
  );
};

export default ProjectDetailPage;
