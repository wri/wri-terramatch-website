import { useEffect, useRef, useState } from "react";

import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import { AuditLogEntity } from "@/admin/components/ResourceTabs/AuditLogTab/constants/types";
import {
  loadLightNurseryReportList,
  loadLightProjectReport,
  loadLightSiteReportList,
  loadNurseryIndex,
  loadSiteIndex
} from "@/connections/Entity";
import { loadAllSitePolygons } from "@/connections/SitePolygons";
import { loadTask } from "@/connections/Task";
import { NURSERY_REPORT, POLYGON, PROJECT_REPORT, SITE, SITE_REPORT } from "@/constants/entities";

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
  entityType: AuditLogEntity;
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

  const unnamedTitleAndSort = (
    list: EntityListItem[],
    nameProperty: keyof EntityListItem,
    entityType: AuditLogEntity
  ) => {
    const unnamedItems = list?.map((item: EntityListItem) => {
      if (!item[nameProperty] && AuditLogButtonStates.PROJECT_REPORT != buttonToggle) {
        return {
          ...item,
          [nameProperty]:
            entityType === POLYGON ? "Unnamed Polygon" : entityType === SITE ? "Unnamed Site" : "Unnamed Nursery"
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

  const loadEntityList = async () => {
    const isSiteProjectLevel = entityLevel === AuditLogButtonStates.PROJECT;

    let _entityList: EntityListItem[] = [];

    if (entityType == POLYGON) {
      // Use v3 loadAllSitePolygons for polygons with proper pagination
      const entityName = isSiteProjectLevel ? "projects" : "sites";
      const polygons = await loadAllSitePolygons({
        entityName,
        entityUuid: entity.uuid
      });

      // Transform v3 SitePolygonLightDto[] to EntityListItem[]
      _entityList = polygons.map(polygon => ({
        name: polygon.name ?? undefined,
        uuid: polygon.uuid,
        status: polygon.status,
        polygonUuid: polygon.polygonUuid ?? undefined
      }));
    } else if (isProjectReport) {
      const res = await loadReportsForTask({ pathParams: { uuid: entity.taskUuid } });
      _entityList = res.data;
    } else {
      // Handle other entity types (SITE, NURSERY)
      const fetchToProject = entityType == SITE ? loadSiteIndex : loadNurseryIndex;
      const params = isSiteProjectLevel
        ? entityType == SITE
          ? { projectUuid: entity.uuid }
          : { uuid: entity.uuid }
        : { projectUuid: entity.uuid };
      const res = await fetchToProject({
        // @ts-ignore
        pathParams: params
      });
      _entityList = ((res as any)?.data ?? []) as EntityListItem[];
    }
    const statusActionsMap = {
      [AuditLogButtonStates.PROJECT_REPORT as number]: {
        entityType: PROJECT_REPORT,
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
        entityType: SITE_REPORT,
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
        entityType: NURSERY_REPORT,
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
    const nameProperty: keyof EntityListItem = "name";
    const transformEntityListItem = (item: EntityListItem) => {
      return {
        title: item?.[nameProperty],
        uuid: item?.uuid,
        value: item?.uuid,
        meta: item?.status,
        status: item?.status,
        polygonUuid: item?.polygonUuid
      };
    };
    const _list = unnamedTitleAndSort(
      isProjectReport ? statusActionsMap[buttonToggle!]?.list : _entityList,
      isProjectReport ? "title" : nameProperty,
      entityType
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
