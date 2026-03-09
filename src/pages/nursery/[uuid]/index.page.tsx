import { useT } from "@transifex/react";
import { useRouter } from "next/router";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullNursery } from "@/connections/Entity";
import FrameworkProvider from "@/context/framework.provider";
import { ToastType, useToastContext } from "@/context/toast.provider";
import { useValueChanged } from "@/hooks/useValueChanged";
import NurseryOverviewTab from "@/pages/nursery/[uuid]/tabs/Overview";
import GalleryTab from "@/pages/project/[uuid]/tabs/Gallery";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import NurseryBanner from "@/redesignComponents/content/Banner/NurseryBanner/NurseryBanner";
import { NurseryIcon } from "@/redesignComponents/foundations/Icons";
import Log from "@/utils/log";

import AuditLog from "./tabs/AuditLog";
import CompletedReportsTab from "./tabs/CompletedReports";

const NurseryDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const nurseryUUID = router.query.uuid as string;

  const [isLoaded, { data: nursery, loadFailure }] = useFullNursery({ id: nurseryUUID });
  const { openToast } = useToastContext();
  useValueChanged(isLoaded, () => {
    if (isLoaded && nursery == null) {
      Log.error("Nursery not found", { nurseryUUID, loadFailure });
      openToast("Nursery not found", ToastType.ERROR);
    }
  });

  const TabItems = [
    { key: "overview", title: t("Overview"), body: <NurseryOverviewTab nursery={nursery} /> },
    {
      key: "gallery",
      title: t("Gallery"),
      body: (
        <GalleryTab
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
    { key: "completed-tasks", title: t("Completed Reports"), body: <CompletedReportsTab nursery={nursery} /> },
    { key: "audit-log", title: t("Audit Log"), body: <AuditLog nursery={nursery} /> }
  ];

  return (
    <FrameworkProvider frameworkKey={nursery?.frameworkKey}>
      <LoadingContainer loading={!isLoaded}>
        {nursery == null ? null : (
          <>
            <NurseryBanner
              className="top-[70px]"
              nursery={nursery}
              breadcrumbs={[
                {
                  label: "Nurseries",
                  link: "/",
                  icon: <NurseryIcon className="!text-theme-primary-900 !h-3.5 !w-3.5" />
                },
                { label: nursery.projectName ?? "", link: `/project/${nursery.projectUuid}` },
                { label: nursery.name ?? "", link: `/nursery/${nursery.uuid}` }
              ]}
              suffix={
                <div className="flex gap-1.5">
                  <div className="flex gap-1.5">
                    <Button variant="borderless" size="small" className="underline underline-offset-2">
                      {t("Project Profile")}
                    </Button>
                    <span className="text-theme-neutral-300 text-sm">|</span>
                    <Button variant="borderless" size="small" className="underline underline-offset-2">
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
                  defaultValue: TabItems[0].key,
                  onTabClick: (tabValue: string) => {
                    router.push(`/nursery/${nurseryUUID}?tab=${tabValue}`);
                  }
                }
              }}
            />
            <div className="w-full">{TabItems.find(item => item.key === router.query.tab)?.body}</div>
          </>
        )}
        <PageFooter />
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default NurseryDetailPage;
