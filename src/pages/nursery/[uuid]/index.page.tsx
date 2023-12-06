import { useT } from "@transifex/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Else, If, Then, When } from "react-if";

import Button from "@/components/elements/Button/Button";
import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useModalContext } from "@/context/modal.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useDeleteV2NurseriesUUID, useGetV2ENTITYUUID } from "@/generated/apiComponents";
import { useGetEditEntityHandler } from "@/hooks/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/useGetExportEntityHandler";
import NurseryOverviewTab from "@/pages/nursery/[uuid]/tabs/Overview";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";
import GalleryTab from "@/pages/project/[uuid]/tabs/Gallery";

import CompletedReportsTab from "./tabs/CompletedReports";

const NurseryDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const { openModal, closeModal } = useModalContext();
  const nurseryUUID = router.query.uuid as string;
  const { openToast } = useToastContext();

  const { data, isLoading } = useGetV2ENTITYUUID({
    pathParams: { uuid: nurseryUUID, entity: "nurseries" }
  });

  const { mutate: deleteNursery } = useDeleteV2NurseriesUUID({
    onSuccess() {
      router.push("/my-projects");
      openToast(t("The nursery has been successfully deleted"));
    },
    onError() {
      openToast(t("Something went wrong!"), ToastType.ERROR);
    }
  });

  const nursery = (data?.data || {}) as any;
  const { handleExport } = useGetExportEntityHandler("nurseries", nursery.uuid, nursery.name);

  const { handleEdit } = useGetEditEntityHandler({
    entityName: "nurseries",
    entityUUID: nurseryUUID,
    entityStatus: nursery.status,
    updateRequestStatus: nursery.update_request_status
  });

  const onDeleteNursery = () => {
    openModal(
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={t("Confirm Nursery Deletion")}
        content={t(
          "All data and content will be irreversibly removed and this action cannot be undone. Are you sure you want to permanently delete this nursery? "
        )}
        primaryButtonProps={{
          children: t("Delete"),
          onClick: () => {
            deleteNursery({ pathParams: { uuid: nurseryUUID } });
            closeModal();
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: closeModal
        }}
      />
    );
  };

  return (
    <LoadingContainer loading={isLoading}>
      <Head>
        <title>{`${t("Nursery")} ${nursery.name}`}</title>
      </Head>
      <PageBreadcrumbs
        links={[
          { title: t("My Projects"), path: "/my-projects" },
          { title: nursery.project?.name, path: `/project/${nursery.project?.uuid}` },
          { title: nursery.name }
        ]}
      />
      <PageHeader
        className="h-[203px]"
        title={nursery.name}
        subtitles={[
          `${t("Project name")}: ${nursery.project?.name}`,
          nursery.framework_key === "ppc" ? t("Priceless Planet Coalition") : t("TerraFund")
        ]}
        hasBackButton={false}
      >
        <div className="flex gap-4">
          <When condition={nursery.nursery_reports_total === 0}>
            <Button variant="secondary" onClick={onDeleteNursery}>
              {t("Delete")}
            </Button>
          </When>
          <If condition={nursery.status === "started"}>
            <Then>
              <Button as={Link} href={`/entity/nurseries/edit/${nurseryUUID}`}>
                {t("Continue Nursery")}
              </Button>
            </Then>
            <Else>
              <Button variant="secondary" onClick={handleExport}>
                {t("Export")}
              </Button>
              <Button onClick={handleEdit}>{t("Edit")}</Button>
            </Else>
          </If>
        </div>
      </PageHeader>
      <StatusBar entityName="nurseries" entity={nursery} />
      <SecondaryTabs
        tabItems={[
          { key: "overview", title: t("Overview"), body: <NurseryOverviewTab nursery={nursery} /> },
          {
            key: "gallery",
            title: t("Gallery"),
            body: (
              <GalleryTab
                modelName="nurseries"
                modelUUID={nursery.uuid}
                modelTitle={t("Nursery")}
                boundaryGeojson={nursery.boundary_geojson}
                emptyStateContent={t(
                  "Your gallery is currently empty. Add images by using the 'Edit' button on this nursery."
                )}
              />
            )
          },
          {
            key: "completed-tasks",
            title: t("Completed Reports"),
            body: <CompletedReportsTab nursery={nursery} />
          }
        ]}
        containerClassName="max-w-7xl px-10 xl:px-0 w-full overflow-auto"
      />
    </LoadingContainer>
  );
};

export default NurseryDetailPage;
