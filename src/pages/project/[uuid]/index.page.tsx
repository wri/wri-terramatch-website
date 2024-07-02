import { useT } from "@transifex/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { MapAreaProvider } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import {
  GetV2ReportingFrameworksUUIDResponse,
  useDeleteV2ProjectsUUID,
  useGetV2ProjectsUUID,
  useGetV2ReportingFrameworksUUID
} from "@/generated/apiComponents";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import { useFramework } from "@/hooks/useFramework";
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
  const { openModal, closeModal } = useModalContext();
  const { openToast } = useToastContext();
  const projectUUID = router.query.uuid as string;

  const { data, isLoading, refetch } = useGetV2ProjectsUUID({
    pathParams: { uuid: projectUUID }
  });

  const project = (data?.data || {}) as any;
  const { isPPC, isTerrafund, isHBF } = useFramework(project);

  const { handleExport } = useGetExportEntityHandler("projects", project.uuid, project.name);
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "projects",
    entityUUID: projectUUID,
    entityStatus: project.status,
    updateRequestStatus: project.update_request_status
  });

  const { mutate: deleteProject } = useDeleteV2ProjectsUUID({
    onSuccess() {
      router.push("/my-projects");
      openToast(t("The project has been successfully deleted"));
    },
    onError() {
      openToast(t("Something went wrong!"), ToastType.ERROR);
    }
  });

  const { data: reportingFrameworkData } = useGetV2ReportingFrameworksUUID(
    { pathParams: { uuid: project.framework_uuid } },
    {
      enabled: !!project.framework_uuid
    }
  );
  //@ts-ignore
  const reportingFramework = (reportingFrameworkData?.data || {}) as GetV2ReportingFrameworksUUIDResponse;

  const onDeleteProject = () => {
    openModal(
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={t("Confirm Project Draft Deletion")}
        content={t(
          "All data and content will be irreversibly removed and this action cannot be undone. Are you sure you want to permanently delete this project draft? "
        )}
        primaryButtonProps={{
          children: t("Yes"),
          onClick: () => {
            deleteProject({ pathParams: { uuid: projectUUID } });
            closeModal();
          }
        }}
        secondaryButtonProps={{
          children: t("No"),
          onClick: closeModal
        }}
      />
    );
  };

  return (
    <MapAreaProvider>
      <LoadingContainer loading={isLoading}>
        <Head>
          <title>{t("Project")}</title>
        </Head>
        <PageBreadcrumbs links={[{ title: t("My Projects"), path: "/my-projects" }, { title: project.name }]} />
        <PageHeader
          className="h-[203px]"
          title={project.name}
          subtitles={[
            `${t("Organisation")}: ${project.organisation?.name}`,
            isPPC
              ? t("Priceless Planet Coalition")
              : isHBF
              ? "Harit Bharat Fund"
              : isTerrafund
              ? t("TerraFund")
              : reportingFramework.name
          ]}
          hasBackButton={false}
        >
          <If condition={project.status === "started"}>
            <Then>
              <div className="flex gap-4">
                <Button variant="secondary" onClick={() => onDeleteProject()}>
                  {t("Delete")}
                </Button>
                <Button as={Link} href={`/entity/projects/edit/${projectUUID}`}>
                  {t("Continue Project")}
                </Button>
              </div>
            </Then>
            <Else>
              <div className="flex gap-4">
                <Button variant="secondary" onClick={handleExport}>
                  {t("Export")}
                </Button>
                <Button onClick={handleEdit}>{t("Edit")}</Button>
              </div>
            </Else>
          </If>
        </PageHeader>
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
              hidden: isPPC
            },
            {
              key: "reporting-tasks",
              title: t("Reporting Tasks"),
              body: (
                <ReportingTasksTab
                  projectUUID={project.uuid}
                  reportingPeriod={reportingFramework.slug === "ppc" ? "quarterly" : "bi-annually"}
                />
              )
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
    </MapAreaProvider>
  );
};

export default ProjectDetailPage;
