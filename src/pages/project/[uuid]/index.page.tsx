import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { FC } from "react";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import Loader from "@/components/generic/Loading/Loader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullProject } from "@/connections/Entity";
import FrameworkProvider, { Framework } from "@/context/framework.provider";
import { useLoading } from "@/context/loaderAdmin.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import ProjectHeader from "@/pages/project/[uuid]/components/ProjectHeader";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";
import ProjectDetailTab from "@/pages/project/[uuid]/tabs/Details";
import GalleryTab from "@/pages/project/[uuid]/tabs/Gallery";
import ProjectOverviewTab from "@/pages/project/[uuid]/tabs/Overview";
import ProjectNurseriesTab from "@/pages/project/[uuid]/tabs/ProjectNurseries";
import ProjectSitesTab from "@/pages/project/[uuid]/tabs/ProjectSites";
import ReportingTasksTab from "@/pages/project/[uuid]/tabs/ReportingTasks";

import AuditLog from "./tabs/AuditLog";
import GoalsAndProgressTab from "./tabs/GoalsAndProgress";

const ButtonStates = {
  PROJECTS: 0,
  SITE: 1,
  POLYGON: 2
};

type ProjectContentProps = {
  project: ProjectFullDto;
  refetch: () => void;
};
const ProjectContent: FC<ProjectContentProps> = ({ project, refetch }) => {
  const t = useT();
  return (
    <>
      <Head>
        <title>{t("Project")}</title>
      </Head>
      <PageBreadcrumbs links={[{ title: t("My Projects"), path: "/my-projects" }, { title: project?.name ?? "" }]} />
      <ProjectHeader {...{ project }} />
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
    </>
  );
};

const ProjectDetailPage = () => {
  const router = useRouter();
  // const t = useT();
  const { loading } = useLoading();
  const projectUUID = router.query.uuid as string;

  // const { openToast } = useToastContext();
  const [isLoaded, { entity: project, refetch }] = useFullProject({ uuid: projectUUID });
  // const deleteProject = useDeleteProject(
  //   projectUUID,
  //   () => {
  //     router.push("/my-projects");
  //     openToast(t("The project has been successfully deleted."));
  //   },
  //   failure => {
  //     Log.error("Project delete failed", failure);
  //     openToast(t("Something went wrong!"), ToastType.ERROR);
  //   }
  // );

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
