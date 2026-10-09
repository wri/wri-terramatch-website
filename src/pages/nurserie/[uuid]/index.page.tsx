import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import EntityGalleryTab from "@/components/extensive/EntityGallery/EntityGalleryTab";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullNursery } from "@/connections/Entity";
import FrameworkProvider from "@/context/framework.provider";
import { useValueChanged } from "@/hooks/useValueChanged";
import NurseryOverviewTab from "@/pages/nurserie/[uuid]/tabs/Overview";
import EntityProfileReportsTab from "@/pages/reports/components/EntityProfileReportsTab";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import NurseryBanner from "@/redesignComponents/content/Banner/NurseryBanner/NurseryBanner";
import { NurseryIcon, ProjectIcon } from "@/redesignComponents/foundations/Icons";
import { showToast } from "@/redesignComponents/status/Toast/showToast";
import ProjectResponsiveTypography from "@/styles/ResponsiveTypography";
import Log from "@/utils/log";

import { getNurseryDetailUrl, NURSERY_INDEX_ORIGIN } from "../nurseryIndex.utils";
import AuditLog from "./tabs/AuditLog";
import GoalsAndProgressTab from "./tabs/GoalsAndProgress";

const NurseryDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const nurseryUUID = router.query.uuid as string;

  const [isLoaded, { data: nursery, loadFailure }] = useFullNursery({ id: nurseryUUID });
  useValueChanged(isLoaded, () => {
    if (isLoaded && nursery == null) {
      Log.error("Nursery not found", { nurseryUUID, loadFailure });
      showToast({
        label: "Nursery not found",
        type: "error",
        placement: "bottom",
        duration: 5000
      });
    }
  });

  const activeTab = (router.query.tab as string) ?? "overview";
  const isFromNurseryIndex = router.query.origin === NURSERY_INDEX_ORIGIN;

  const TabItems = [
    { key: "overview", title: t("Overview"), body: <NurseryOverviewTab nursery={nursery!} /> },
    {
      key: "gallery",
      title: t("Gallery"),
      body: (
        <EntityGalleryTab
          modelName="nurseries"
          modelUUID={nursery?.uuid ?? ""}
          modelTitle={t("Nursery")}
          entityData={nursery}
          emptyStateContent={t(
            "Your gallery is currently empty. Add images by using the 'Edit' button on this nursery."
          )}
        />
      )
    },
    { key: "progress-and-goals", title: t("Progress & Goals"), body: <GoalsAndProgressTab nursery={nursery!} /> },
    {
      key: "reports",
      title: t("Reports"),
      body: (
        <EntityProfileReportsTab
          source="nursery"
          entityUuid={nurseryUUID}
          projectUuid={nursery?.projectUuid ?? null}
          origin={isFromNurseryIndex ? NURSERY_INDEX_ORIGIN : undefined}
        />
      )
    },
    { key: "audit-log", title: t("History"), body: <AuditLog nursery={nursery} /> }
  ];

  return (
    <FrameworkProvider frameworkKey={nursery?.frameworkKey}>
      <ProjectResponsiveTypography />
      <LoadingContainer loading={!isLoaded}>
        {nursery == null ? null : (
          <>
            <NurseryBanner
              nursery={nursery}
              breadcrumbs={
                isFromNurseryIndex
                  ? [
                      {
                        label: t("Nurseries"),
                        link: "/nurserie",
                        icon: <NurseryIcon className="!text-theme-primary-900" />
                      },
                      { label: nursery.name ?? "-", link: getNurseryDetailUrl(nursery.uuid, true) }
                    ]
                  : [
                      {
                        label: t("Projects"),
                        link: "/my-projects",
                        icon: <ProjectIcon className="!text-theme-primary-900" />
                      },
                      { label: nursery.projectName ?? "", link: `/project/${nursery.projectUuid}` },
                      { label: nursery.name ?? "-", link: `/nurserie/${nursery.uuid}` }
                    ]
              }
              suffix={
                <div className="flex gap-1.5">
                  <div className="flex gap-1.5">
                    <Button
                      variant="borderless"
                      size="small"
                      className="underline underline-offset-2"
                      onClick={() => router.push(`/project/${nursery.projectUuid}`)}
                    >
                      {t("Project Profile")}
                    </Button>
                    <span className="text-sm text-theme-neutral-300">|</span>
                    <Button
                      variant="borderless"
                      size="small"
                      className="underline underline-offset-2"
                      onClick={() =>
                        router.push(getNurseryDetailUrl(nursery.uuid, isFromNurseryIndex, "reports"), undefined, {
                          shallow: true
                        })
                      }
                    >
                      {t("Nursery Reports")}
                    </Button>
                  </div>
                </div>
              }
              toolbar={{
                tabBar: {
                  tabs: TabItems.map(item => ({
                    value: item.key,
                    label: item.title
                  })),
                  defaultValue: activeTab,
                  onTabClick: (tabValue: string) => {
                    router.push(getNurseryDetailUrl(nurseryUUID, isFromNurseryIndex, tabValue), undefined, {
                      shallow: true
                    });
                  }
                }
              }}
            />
            <div className="flex flex-1">{TabItems.find(item => item.key === activeTab)?.body}</div>
          </>
        )}
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default NurseryDetailPage;
