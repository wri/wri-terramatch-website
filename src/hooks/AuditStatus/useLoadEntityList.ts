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
import { useAllSitePolygons } from "@/connections/SitePolygons";
import { loadTask } from "@/connections/Task";
import { NURSERY, NURSERY_REPORT, POLYGON, PROJECT_REPORT, SITE, SITE_REPORT } from "@/constants/entities";
import { fetchGetV2ProjectsUUIDSitePolygonsAll } from "@/generated/apiComponents";

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

const transformEntityListItem = (item: EntityListItem): SelectedItem => ({
  title: item?.name,
  uuid: item?.uuid,
  value: item?.uuid,
  meta: item?.status,
  status: item?.status,
  polygonUuid: item?.polygonUuid
});

const unnamedTitleAndSort = (
  list: EntityListItem[],
  nameProperty: keyof EntityListItem,
  entityType: AuditLogEntity,
  buttonToggle?: number
) => {
  const unnamedItems = list?.map((item: EntityListItem) => {
    if (!item[nameProperty] && AuditLogButtonStates.PROJECT_REPORT !== buttonToggle) {
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

  const { data: sitePolygons, isLoading: isLoadingSitePolygons } = useAllSitePolygons({
    entityName: entityType == SITE ? "sites" : "projects",
    entityUuid: entity?.uuid,
    enabled:
      (entityLevel === AuditLogButtonStates.PROJECT || entityLevel === AuditLogButtonStates.SITE) && !!entity.uuid
  });

  const loadEntityList = async () => {
    const isSiteProjectLevel = entityLevel === AuditLogButtonStates.PROJECT;
    const fetchToProject =
      entityType == SITE
        ? loadSiteIndex
        : entityType == POLYGON
        ? fetchGetV2ProjectsUUIDSitePolygonsAll
        : loadNurseryIndex;
    const fetchAction = isSiteProjectLevel ? fetchToProject : isProjectReport ? loadReportsForTask : () => {};

    let res;
    if (buttonToggle == AuditLogButtonStates.POLYGON) {
      res = sitePolygons;
    } else if (isSiteProjectLevel) {
      if (entityType == POLYGON) {
        res = await fetchGetV2ProjectsUUIDSitePolygonsAll({
          pathParams: { uuid: entity.uuid }
        });
      } else {
        const filter =
          entityType == SITE || entityType == NURSERY ? { projectUuid: entity.uuid } : { uuid: entity.uuid };
        res = await fetchAction({ filter } as never);
      }
    } else if (isProjectReport) {
      res = await loadReportsForTask({
        pathParams: { uuid: entity.taskUuid ?? entity.task_uuid }
      });
    } else {
      res = await fetchAction({} as never);
    }
    const _entityList = (res as { data: EntityListItem[] })?.data ?? (res as EntityListItem[]);
    console.log("entityList", entityType);
    const statusActionsMap = {
      [AuditLogButtonStates.PROJECT_REPORT as number]: {
        entityType: PROJECT_REPORT,
        list: _entityList
          ?.filter(entity => entity.type == PROJECT_REPORT)
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
    const _list = unnamedTitleAndSort(
      isProjectReport ? statusActionsMap[buttonToggle!]?.list : _entityList,
      isProjectReport ? "title" : "name",
      entityType,
      buttonToggle
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

        if (currentSelected) {
          setSelected(isProjectReport ? currentSelected! : transformEntityListItem(currentSelected as EntityListItem));
        } else {
          setSelected(isProjectReport ? _list[0] : transformEntityListItem(_list[0]));
        }
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

  // When buttonToggle is POLYGON, automatically update when hook data is ready
  useEffect(() => {
    if (buttonToggle === AuditLogButtonStates.POLYGON && sitePolygons.length > 0 && !isLoadingSitePolygons) {
      // Map SitePolygonLightDto[] to EntityListItem[]
      const _entityList: EntityListItem[] = sitePolygons.map(polygon => ({
        name: polygon.name!,
        uuid: polygon.uuid!,
        status: polygon.status,
        polygonUuid: polygon.polygonUuid!
      }));

      const _list = unnamedTitleAndSort(_entityList, "name", entityType, buttonToggle);
      setEntityListItem(_list?.map((item: EntityListItem) => transformEntityListItem(item)) ?? []);
      if (_list?.length > 0) {
        // Always select the first item when data is ready
        if (isFirstLoad.current) {
          isFirstLoad.current = false;
        }
        setSelected(transformEntityListItem(_list[0]));
      }
    }
  }, [buttonToggle, sitePolygons, isLoadingSitePolygons, entityType]);

  return { entityListItem, selected, setSelected, loadEntityList };
};

export default useLoadEntityList;
