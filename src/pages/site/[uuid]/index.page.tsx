import { useT } from "@transifex/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Else, If, Then, When } from "react-if";

import Button from "@/components/elements/Button/Button";
import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import { getActionCardStatusMapper } from "@/components/extensive/ActionTracker/ActionTrackerCard";
import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import PageHeader from "@/components/extensive/PageElements/Header/PageHeader";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useModalContext } from "@/context/modal.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useDeleteV2SitesUUID, useGetV2SitesUUID } from "@/generated/apiComponents";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import { useGetExportEntityHandler } from "@/hooks/entity/useGetExportEntityHandler";
import { useFramework } from "@/hooks/useFramework";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";
import GalleryTab from "@/pages/project/[uuid]/tabs/Gallery";
import SiteCompletedReportsTab from "@/pages/site/[uuid]/tabs/CompletedReports";
import SiteDetailTab from "@/pages/site/[uuid]/tabs/Details";
import GoalsAndProgressTab from "@/pages/site/[uuid]/tabs/GoalsAndProgress";
import SiteOverviewTab from "@/pages/site/[uuid]/tabs/Overview";

const SiteDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const { openModal, closeModal } = useModalContext();
  const siteUUID = router.query.uuid as string;
  const { openToast } = useToastContext();

  const { data, isLoading } = useGetV2SitesUUID({
    pathParams: { uuid: siteUUID }
  });
  const { mutate: deleteSite } = useDeleteV2SitesUUID({
    onSuccess() {
      router.push("/my-projects");
      openToast(t("The site has been successfully deleted"));
    },
    onError() {
      openToast(t("Something went wrong!"), ToastType.ERROR);
    }
  });

  const site = (data?.data || {}) as any;
  const { isPPC } = useFramework(site);
  const siteStatus = getActionCardStatusMapper(t)[site.status]?.status;
  const { handleExport } = useGetExportEntityHandler("sites", site.uuid, site.name);
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "sites",
    entityUUID: siteUUID,
    entityStatus: site.status,
    updateRequestStatus: site.update_request_status
  });

  const onDeleteSite = () => {
    openModal(
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={t("Confirm Site Deletion")}
        content={t(
          "All data and content will be irreversibly removed and this action cannot be undone. Are you sure you want to permanently delete this site? "
        )}
        primaryButtonProps={{
          children: t("Delete"),
          onClick: () => {
            deleteSite({ pathParams: { uuid: siteUUID } });
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

  const subtitles = [
    `${t("Organisation")}: ${site.organisation?.name}`,
    isPPC ? t("Priceless Planet Coalition") : t("TerraFund")
  ];
  if (isPPC) {
    subtitles.push(t("Site ID: {id}", { id: site.ppc_external_id }));
  }

  return (
    <LoadingContainer loading={isLoading}>
      <Head>
        <title>{`${t("Site")} ${site.name}`}</title>
      </Head>
      <PageBreadcrumbs
        links={[
          { title: t("My Projects"), path: "/my-projects" },
          { title: site.project?.name, path: `/project/${site.project?.uuid}` },
          { title: site.name }
        ]}
      />
      <PageHeader className="h-[203px]" title={site.name} subtitles={subtitles} hasBackButton={false}>
        <div className="flex gap-4">
          <When condition={site.site_reports_total === 0}>
            <Button variant="secondary" onClick={onDeleteSite}>
              {t("Delete")}
            </Button>
          </When>
          <If condition={siteStatus === "edit"}>
            <Then>
              <Button as={Link} href={`/entity/sites/edit/${siteUUID}`}>
                {t("Continue Site")}
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
      <StatusBar entityName="sites" entity={site} />
      <SecondaryTabs
        tabItems={[
          { key: "overview", title: t("Overview"), body: <SiteOverviewTab site={site} /> },
          { key: "details", title: t("Details"), body: <SiteDetailTab site={site} /> },
          {
            key: "gallery",
            title: t("Gallery"),
            body: (
              <GalleryTab
                modelName="sites"
                modelUUID={site.uuid}
                modelTitle={t("Site")}
                boundaryGeojson={site.boundary_geojson}
                emptyStateContent={t(
                  "Your gallery is currently empty. Add images by using the 'Edit' button on this site, or images added to your site reports will also automatically populate this gallery."
                )}
              />
            )
          },
          { key: "goals", title: t("Progress & Goals"), body: <GoalsAndProgressTab site={site} /> },
          {
            key: "completed-tasks",
            title: t("Completed Reports"),
            body: <SiteCompletedReportsTab siteUUID={site.uuid} />
          }
        ]}
        containerClassName="max-w-7xl px-10 xl:px-0 w-full overflow-auto"
      />
    </LoadingContainer>
  );
};

export default SiteDetailPage;
