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
import { loadTask } from "@/connections/Task";
import { NURSERY_REPORT, POLYGON, PROJECT_REPORT, SITE, SITE_REPORT } from "@/constants/entities";
import { fetchGetV2ProjectsUUIDSitePolygonsAll, fetchGetV2SitesSitePolygon } from "@/generated/apiComponents";

export interface SelectedItem {
  title?: string | undefined;
  uuid?: string | undefined;
  value?: string | undefined;
  meta?: string | undefined;
  status?: string | undefined;
  poly_id?: string | undefined;
}

interface UseLoadEntityListParams {
  entity: any;
  entityType: AuditLogEntity;
  buttonToggle?: number;
  entityLevel?: number;
  isProjectReport?: boolean;
}

export interface EntityListItem {
  poly_name?: string | undefined;
  name?: string | undefined;
  uuid?: string | undefined;
  value?: string | undefined;
  meta?: string | undefined;
  status?: string | undefined;
  poly_id?: string | undefined;
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

  const getNameProperty = (entityType: string): keyof EntityListItem => {
    switch (entityType) {
      case POLYGON:
        return "poly_name";
      case SITE:
        return "name";
      default:
        return "name";
    }
  };

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
    const fetchToProject =
      entityType == SITE
        ? loadSiteIndex
        : entityType == POLYGON
        ? fetchGetV2ProjectsUUIDSitePolygonsAll
        : loadNurseryIndex;
    const fetchAction = isSiteProjectLevel
      ? fetchToProject
      : isProjectReport
      ? loadReportsForTask
      : fetchGetV2SitesSitePolygon;
    const params = isSiteProjectLevel
      ? entityType == SITE
        ? { projectUuid: entity.uuid }
        : { uuid: entity.uuid }
      : isProjectReport
      ? { uuid: entity.taskUuid ?? entity.task_uuid }
      : { site: entity.uuid };
    const res = await fetchAction({
      // @ts-ignore
      pathParams: params
    });
    const _entityList = (res as { data: EntityListItem[] })?.data ?? (res as EntityListItem[]);
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
            poly_id: undefined
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
            poly_id: undefined
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
            poly_id: undefined
          }))
      }
    };
    const nameProperty = getNameProperty(entityType);
    const transformEntityListItem = (item: EntityListItem) => {
      return {
        title: item?.[nameProperty],
        uuid: item?.uuid,
        value: item?.uuid,
        meta: item?.status,
        status: item?.status,
        poly_id: item?.poly_id
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
