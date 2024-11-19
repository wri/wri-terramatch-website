import { FC, useEffect, useState } from "react";
import { Show, TabbedShowLayout } from "react-admin";
import { If } from "react-if";

import ShowActions from "@/admin/components/Actions/ShowActions";
import AuditLogTab from "@/admin/components/ResourceTabs/AuditLogTab/AuditLogTab";
import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import ChangeRequestsTab from "@/admin/components/ResourceTabs/ChangeRequestsTab/ChangeRequestsTab";
import DocumentTab from "@/admin/components/ResourceTabs/DocumentTab/DocumentTab";
import GalleryTab from "@/admin/components/ResourceTabs/GalleryTab/GalleryTab";
import InformationTab from "@/admin/components/ResourceTabs/InformationTab";
import PolygonReviewTab from "@/admin/components/ResourceTabs/PolygonReviewTab";
import ShowTitle from "@/admin/components/ShowTitle";
import { RecordFrameworkProvider } from "@/context/framework.provider";
import { MapAreaProvider } from "@/context/mapArea.provider";

const informationTabTitle = {
  sites: "Site Information",
  projects: "Project Information",
  nurseries: "Nursery Information",
  "project-reports": "Project Report Information",
  "site-reports": "Site Report Information",
  "nursery-reports": "Nursery Report Information"
};

const SiteShow: FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    console.log("window.location.href", window.location.href);
    const url = window.location.href;
    const index = url.indexOf("show/");
    console.log("index", index);
    if (index === -1) {
      console.log("setActiveTab", 0);
      setActiveTab(0);
    } else {
      const tabNumber = url.substring(index + 5, url.length);
      console.log("tabNumber", tabNumber);
      setActiveTab(parseInt(tabNumber));
      console.log("setActiveTab", parseInt(tabNumber));
    }
  }, []);

  return (
    <Show
      title={<ShowTitle moduleName="Site" getTitle={record => record?.name} />}
      actions={<ShowActions titleSource="name" resourceName="site" />}
      className="-mt-[50px] bg-neutral-100"
    >
      <RecordFrameworkProvider>
        <TabbedShowLayout>
          <TabbedShowLayout.Tab label={informationTabTitle["sites"]} onClick={() => setActiveTab(0)}>
            <If condition={activeTab === 0}>
              <InformationTab type="sites" setActiveTab={setActiveTab} />
            </If>
          </TabbedShowLayout.Tab>
          <TabbedShowLayout.Tab
            label="Polygon Review"
            onClick={() => {
              setActiveTab(1);
            }}
          >
            <If condition={activeTab === 1}>
              <MapAreaProvider>
                <PolygonReviewTab label="" type={"sites"} />
              </MapAreaProvider>
            </If>
          </TabbedShowLayout.Tab>
          <TabbedShowLayout.Tab
            label={"Site Gallery"}
            onClick={() => {
              setActiveTab(2);
            }}
          >
            <If condition={activeTab === 2}>
              <GalleryTab label="Site Gallery" entity="sites" />
            </If>
          </TabbedShowLayout.Tab>
          <TabbedShowLayout.Tab
            label={"Site Documents"}
            onClick={() => {
              setActiveTab(3);
            }}
          >
            <If condition={activeTab === 3}>
              <DocumentTab label="Site Documents" entity="sites" />
            </If>
          </TabbedShowLayout.Tab>
          <ChangeRequestsTab entity="sites" singularEntity="site" activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabbedShowLayout.Tab
            label="Monitored Data"
            onClick={() => {
              setActiveTab(5);
            }}
          >
            In Progress
          </TabbedShowLayout.Tab>
          <TabbedShowLayout.Tab label="Audit Log" onClick={() => setActiveTab(6)}>
            <If condition={activeTab === 6}>
              <AuditLogTab entity={AuditLogButtonStates.SITE} />
            </If>
          </TabbedShowLayout.Tab>
        </TabbedShowLayout>
      </RecordFrameworkProvider>
    </Show>
  );
};

export default SiteShow;
