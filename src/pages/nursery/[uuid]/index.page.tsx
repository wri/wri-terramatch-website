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
import { ProjectIcon } from "@/redesignComponents/foundations/Icons";
import Log from "@/utils/log";

import AuditLog from "./tabs/AuditLog";
import CompletedReportsTab from "./tabs/CompletedReports";
import GoalsAndProgressTab from "./tabs/GoalsAndProgress";

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

  const currentTab = (router.query.tab as string) ?? "overview";
  const isSuffixView = currentTab === "completed-tasks";
  const activeTab = isSuffixView ? "overview" : currentTab;

  const TabItems = [
    { key: "overview", title: t("Overview"), body: <NurseryOverviewTab nursery={nursery!} /> },
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
    { key: "progress-and-goals", title: t("Progress & Goals"), body: <GoalsAndProgressTab nursery={nursery!} /> },
    { key: "audit-log", title: t("Audit Log"), body: <AuditLog nursery={nursery} /> }
  ];

  const suffixContent = isSuffixView && nursery != null ? <CompletedReportsTab nursery={nursery} /> : null;

  return (
    <FrameworkProvider frameworkKey={nursery?.frameworkKey}>
      <LoadingContainer loading={!isLoaded}>
        {nursery == null ? null : (
          <>
            <NurseryBanner
              nursery={nursery}
              breadcrumbs={[
                {
                  label: t("Projects"),
                  link: "/my-projects",
                  icon: <ProjectIcon className="!text-theme-primary-900" />
                },
                { label: nursery.projectName ?? "", link: `/project/${nursery.projectUuid}` },
                {
                  label: "Nurseries",
                  link: `/project/${nursery.projectUuid}?tab=nurseries`
                },
                { label: nursery.name ?? "", link: `/nursery/${nursery.uuid}` },
                ...(isSuffixView ? [{ label: t("Reports"), link: `/nursery/${nursery.uuid}?tab=completed-tasks` }] : [])
              ]}
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
                    <span className="text-theme-neutral-300 text-sm">|</span>
                    <Button
                      variant="borderless"
                      size="small"
                      className="underline underline-offset-2"
                      onClick={() => router.push(`/nursery/${nursery.uuid}?tab=completed-tasks`)}
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
                  defaultValue: isSuffixView ? "__none__" : activeTab,
                  onTabClick: (tabValue: string) => {
                    router.push(`/nursery/${nurseryUUID}?tab=${tabValue}`, undefined, { shallow: true });
                  }
                }
              }}
            />
            <div className="flex flex-1">{suffixContent ?? TabItems.find(item => item.key === activeTab)?.body}</div>
          </>
        )}
        <PageFooter />
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default NurseryDetailPage;
