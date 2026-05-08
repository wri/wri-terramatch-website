import { useEffect, useRef, useState } from "react";

import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import { AuditStatusEntityType } from "@/connections/AuditStatus";
import {
  loadLightNurseryReportList,
  loadLightProjectReport,
  loadLightSiteReportList,
  loadNurseryIndex,
  loadSiteIndex
} from "@/connections/Entity";
import { loadAllSitePolygons } from "@/connections/SitePolygons";
import { loadTask } from "@/connections/Task";
import { IndexConnection } from "@/connections/util/apiConnectionFactory";
import { NurseryLightDto, SiteLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

export interface SelectedItem {
  title?: string | undefined;
  uuid?: string | undefined;
  value?: string | undefined;
  meta?: string | undefined;
  status?: string | undefined;
  polygonUuid?: string | undefined;
}

interface UseLoadEntityListParams {
  entity: any;
  entityType: AuditStatusEntityType;
  buttonToggle?: number;
  entityLevel?: number;
  isProjectReport?: boolean;
}

export interface EntityListItem {
  name?: string | undefined;
  uuid?: string | undefined;
  value?: string | undefined;
  meta?: string | undefined;
  status?: string | undefined;
  polygonUuid?: string | undefined;
  type?: string | undefined;
  parent_name?: string | undefined;
  report_title?: string | undefined;
  title?: string | undefined;
}

// Munging the v3 task report data into a shape that works for this very complicated component.
async function loadReportsForTask({ pathParams }: { pathParams: { uuid: string } }) {
  const { projectReportUuid, siteReportUuids, nurseryReportUuids } = await loadTask({ id: pathParams.uuid });

  // These data should all be cached from the task load above
  const { data: projectReport } = await loadLightProjectReport({ id: projectReportUuid });
  const { data: siteReports } = await loadLightSiteReportList({ ids: siteReportUuids });
  const { data: nurseryReports } = await loadLightNurseryReportList({ ids: nurseryReportUuids });
  const listItems: EntityListItem[] = [];
  if (projectReport != null) {
    const { projectName, title, status, uuid } = projectReport;
    listItems.push({
      type: "project-report",
      parent_name: projectName ?? "",
      report_title: title ?? "",
      status,
      uuid
    });
  }
  listItems.push(
    ...(siteReports ?? []).map(({ siteName, reportTitle, status, uuid }) => ({
      type: "site-report",
      parent_name: siteName ?? "",
      report_title: reportTitle ?? "",
      status,
      uuid
    }))
  );
  listItems.push(
    ...(nurseryReports ?? []).map(({ nurseryName, reportTitle, status, uuid }) => ({
      type: "nursery-report",
      parent_name: nurseryName ?? "",
      report_title: reportTitle ?? "",
      status,
      uuid
    }))
  );

  return { data: listItems };
}

const unnamedTitleAndSort = (
  list: EntityListItem[],
  nameProperty: keyof EntityListItem,
  entityType: AuditStatusEntityType,
  buttonToggle: number
) => {
  const unnamedItems = list?.map((item: EntityListItem) => {
    if (!item[nameProperty] && AuditLogButtonStates.PROJECT_REPORT != buttonToggle) {
      return {
        ...item,
        [nameProperty]:
          entityType === "sitePolygons"
            ? "Unnamed Polygon"
            : entityType === "sites"
            ? "Unnamed Site"
            : "Unnamed Nursery"
      };
    }
    return item;
  });

  return unnamedItems?.sort((a, b) => {
    const nameA = a[nameProperty];
    const nameB = b[nameProperty];
    return nameA && nameB ? nameA.localeCompare(nameB) : 0;
  });
};

const useLoadEntityList = ({
  entity,
  entityType,
  buttonToggle,
  entityLevel,
  isProjectReport
}: UseLoadEntityListParams) => {
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const [entityListItem, setEntityListItem] = useState<EntityListItem[]>([]);
  const isFirstLoad = useRef(true);

  const loadEntityList = async () => {
    const isSiteProjectLevel = entityLevel === AuditLogButtonStates.PROJECT;

    let _entityList: EntityListItem[] = [];

    if (entityType === "sitePolygons") {
      const entityName = isSiteProjectLevel ? "projects" : "sites";
      const polygons = await loadAllSitePolygons({
        entityName,
        entityUuid: entity.uuid
      });

      _entityList = polygons.map(polygon => ({
        name: polygon.name ?? undefined,
        uuid: polygon.uuid,
        status: polygon.status,
        polygonUuid: polygon.polygonUuid ?? undefined
      }));
    } else if (entityType === "projects") {
      _entityList = [];
    } else if (isProjectReport) {
      const res = await loadReportsForTask({ pathParams: { uuid: entity.taskUuid } });
      _entityList = res.data;
    } else if (entityType === "sites") {
      const res: IndexConnection<SiteLightDto> = await loadSiteIndex({
        filter: { projectUuid: entity.uuid }
      });
      _entityList = (res.data ?? []).map(site => ({
        name: site.name ?? undefined,
        uuid: site.uuid,
        status: site.status ?? undefined,
        polygonUuid: undefined
      }));
    } else if (entityType === "nurseries") {
      const res: IndexConnection<NurseryLightDto> = await loadNurseryIndex({
        filter: { projectUuid: entity.uuid }
      });
      _entityList = (res.data ?? []).map(nursery => ({
        name: nursery.name ?? undefined,
        uuid: nursery.uuid,
        status: nursery.status ?? undefined,
        polygonUuid: undefined
      }));
    }
    const statusActionsMap = {
      [AuditLogButtonStates.PROJECT_REPORT as number]: {
        entityType: "projectReports" as AuditStatusEntityType,
        list: _entityList
          ?.filter(entity => entity.type == "project-report")
          .map(report => ({
            title: (report?.parent_name ?? "") + " " + "(" + report.report_title + ")",
            uuid: report.uuid,
            status: report.status,
            value: report.uuid,
            meta: report.status,
            polygonUuid: undefined
          }))
      },
      [AuditLogButtonStates.SITE_REPORT as number]: {
        entityType: "siteReports" as AuditStatusEntityType,
        list: _entityList
          ?.filter(entity => entity.type == "site-report")
          .map(report => ({
            title: (report?.parent_name ?? "") + " " + "(" + report.report_title + ")",
            uuid: report.uuid,
            status: report.status,
            value: report.uuid,
            meta: report.status,
            polygonUuid: undefined
          }))
      },
      [AuditLogButtonStates.NURSERY_REPORT as number]: {
        entityType: "nurseryReports" as AuditStatusEntityType,
        list: _entityList
          ?.filter(entity => entity.type == "nursery-report")
          .map(report => ({
            title: (report?.parent_name ?? "") + " " + "(" + report.report_title + ")",
            uuid: report.uuid,
            status: report.status,
            value: report.uuid,
            meta: report.status,
            polygonUuid: undefined
          }))
      }
    };
    const transformEntityListItem = (item: EntityListItem) => {
      return {
        title: item?.name,
        uuid: item?.uuid,
        value: item?.uuid,
        meta: item?.status,
        status: item?.status,
        polygonUuid: item?.polygonUuid
      };
    };
    const _list = unnamedTitleAndSort(
      isProjectReport ? statusActionsMap[buttonToggle!]?.list : _entityList,
      isProjectReport ? "title" : "name",
      entityType,
      buttonToggle as number
    );
    setEntityListItem(isProjectReport ? _list : _list?.map((item: EntityListItem) => transformEntityListItem(item)));
    if (_list?.length > 0) {
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        setSelected(isProjectReport ? _list[0] : transformEntityListItem(_list[0]));
      } else {
        const currentSelected = isProjectReport
          ? statusActionsMap[buttonToggle!]?.list?.find(item => item?.uuid === selected?.uuid)
          : _entityList?.find(item => item?.uuid === selected?.uuid);
        setSelected(isProjectReport ? currentSelected! : transformEntityListItem(currentSelected as EntityListItem));
      }
    } else {
      setSelected(null);
    }
  };
  useEffect(() => {
    setSelected(null);
    setEntityListItem([]);
    isFirstLoad.current = true;
  }, [entityType, buttonToggle]);

  return { entityListItem, selected, setSelected, loadEntityList };
};

export default useLoadEntityList;
