import { useEffect, useRef, useState } from "react";

import { AuditLogButtonStates } from "@/admin/components/ResourceTabs/AuditLogTab/constants/enum";
import { AuditLogEntity } from "@/admin/components/ResourceTabs/AuditLogTab/constants/types";
import { POLYGON, SITE } from "@/constants/entities";
import {
  fetchGetV2ProjectsUUIDSitePolygonsAll,
  fetchGetV2ProjectsUUIDSites,
  fetchGetV2SitesSitePolygon
} from "@/generated/apiComponents";

export interface SelectedItem {
  title?: string | undefined;
  uuid?: string | undefined;
  value?: string | undefined;
  meta?: string | undefined;
  status?: string | undefined;
  poly_id?: string | undefined;
}

interface UseLoadEntityListParams {
  entityUuid: string;
  entityType: AuditLogEntity;
  buttonToggle?: number;
  entityLevel?: number;
}

export interface EntityListItem {
  poly_name?: string | undefined;
  name?: string | undefined;
  uuid?: string | undefined;
  value?: string | undefined;
  meta?: string | undefined;
  status?: string | undefined;
  poly_id?: string | undefined;
}

const useLoadEntityList = ({ entityUuid, entityType, buttonToggle, entityLevel }: UseLoadEntityListParams) => {
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

  const unnamedTitleAndSort = (list: EntityListItem[], nameProperty: keyof EntityListItem) => {
    const unnamedItems = list?.map((item: EntityListItem) => {
      if (!item[nameProperty]) {
        return {
          ...item,
          [nameProperty]: nameProperty === "poly_name" ? "Unnamed Polygon" : "Unnamed Site"
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
    const fetchToProject = entityType == SITE ? fetchGetV2ProjectsUUIDSites : fetchGetV2ProjectsUUIDSitePolygonsAll;
    const fetchAction = isSiteProjectLevel ? fetchToProject : fetchGetV2SitesSitePolygon;
    const params = isSiteProjectLevel ? { uuid: entityUuid } : { site: entityUuid };
    const res = await fetchAction({
      // @ts-ignore
      pathParams: params
    });
    const _entityList = (res as { data: EntityListItem[] })?.data ?? (res as EntityListItem[]);
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
    const _list = unnamedTitleAndSort(_entityList, nameProperty);
    setEntityListItem(_list?.map((item: EntityListItem) => transformEntityListItem(item)));
    if (_list?.length > 0) {
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        setSelected(transformEntityListItem(_list[0]));
      } else {
        const currentSelected = _entityList?.find(item => item?.uuid === selected?.uuid);
        setSelected(transformEntityListItem(currentSelected as EntityListItem));
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
