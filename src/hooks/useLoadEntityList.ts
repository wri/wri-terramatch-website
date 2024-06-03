import { useEffect, useRef, useState } from "react";

import { POLYGON, PROJECT, SITE } from "@/constants/entities";
import {
  fetchGetV2AdminSitePolygonUUID,
  fetchGetV2AuditStatusId,
  fetchGetV2ProjectsUUIDSites
} from "@/generated/apiComponents";

export interface SelectedItem {
  title?: string | undefined;
  uuid?: string | undefined;
  value?: string | undefined;
  meta?: string | undefined;
  status?: string | undefined;
}

interface UseLoadEntityListParams {
  entityUuid: string;
  entityType: "Site" | "Polygon" | "Project";
  buttonToogle?: number;
  entityLevel?: string;
}

export interface EntityListItem {
  poly_name?: string | undefined;
  name?: string | undefined;
  uuid?: string | undefined;
  value?: string | undefined;
  meta?: string | undefined;
  status?: string | undefined;
}

const useLoadEntityList = ({ entityUuid, entityType, buttonToogle, entityLevel }: UseLoadEntityListParams) => {
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
    const isSiteProject = entityLevel === PROJECT;
    const fetchToProject = entityType == SITE ? fetchGetV2ProjectsUUIDSites : fetchGetV2AuditStatusId;
    const fetchAction = isSiteProject ? fetchToProject : fetchGetV2AdminSitePolygonUUID;
    const params = isSiteProject && entityType == POLYGON ? { id: entityUuid } : { uuid: entityUuid };
    const res = await fetchAction({
      // @ts-ignore
      pathParams: params
    });
    const _entityList = (res as { data: EntityListItem[] }).data;
    const nameProperty = getNameProperty(entityType);
    const transformEntityListItem = (item: EntityListItem) => {
      return {
        title: item[nameProperty],
        uuid: item?.uuid,
        value: item?.uuid,
        meta: item?.status,
        status: item?.status
      };
    };
    const _list = unnamedTitleAndSort(_entityList, nameProperty);
    setEntityListItem(_list.map((item: EntityListItem) => transformEntityListItem(item)));
    if (_list.length > 0) {
      if (isFirstLoad.current) {
        isFirstLoad.current = false;
        setSelected({
          title: _list[0]?.[nameProperty],
          uuid: _list[0]?.uuid,
          value: _list[0]?.uuid,
          meta: _list[0]?.status,
          status: _list[0]?.status
        });
      } else {
        const currentSelected = (res as { data: EntityListItem[] }).data.find(item => item?.uuid === selected?.uuid);
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
  }, [entityType, buttonToogle]);

  return { entityListItem, selected, setSelected, loadEntityList };
};

export default useLoadEntityList;
