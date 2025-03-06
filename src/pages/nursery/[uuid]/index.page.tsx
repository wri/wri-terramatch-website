import { useT } from "@transifex/react";
import Head from "next/head";
import { useRouter } from "next/router";

import SecondaryTabs from "@/components/elements/Tabs/Secondary/SecondaryTabs";
import PageBreadcrumbs from "@/components/extensive/PageElements/Breadcrumbs/PageBreadcrumbs";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useFullNursery } from "@/connections/Entity";
import FrameworkProvider from "@/context/framework.provider";
import NurseryHeader from "@/pages/nursery/[uuid]/components/NurseryHeader";
import NurseryOverviewTab from "@/pages/nursery/[uuid]/tabs/Overview";
import StatusBar from "@/pages/project/[uuid]/components/StatusBar";
import GalleryTab from "@/pages/project/[uuid]/tabs/Gallery";

import CompletedReportsTab from "./tabs/CompletedReports";

const NurseryDetailPage = () => {
  const t = useT();
  const router = useRouter();
  const nurseryUUID = router.query.uuid as string;

  const [isLoaded, { entity: nursery }] = useFullNursery({ uuid: nurseryUUID });

  return (
    <FrameworkProvider frameworkKey={nursery?.frameworkKey}>
      <LoadingContainer loading={!isLoaded}>
        <Head>
          <title>{`${t("Nursery")} ${nursery?.name}`}</title>
        </Head>
        <PageBreadcrumbs
          links={[
            { title: t("My Projects"), path: "/my-projects" },
            { title: nursery?.projectName, path: `/project/${nursery?.projectUuid}` },
            { title: nursery?.name ?? "" }
          ]}
        />
        <NurseryHeader nursery={nursery} />
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
                  modelUUID={nursery?.uuid!}
                  modelTitle={t("Nursery")}
                  entityData={nursery}
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
          containerClassName="max-w-[82vw] px-10 xl:px-0 w-full  overflow-y-hidden"
        />
      </LoadingContainer>
    </FrameworkProvider>
  );
};

export default NurseryDetailPage;
