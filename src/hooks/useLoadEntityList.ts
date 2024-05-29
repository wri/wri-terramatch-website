import { useEffect, useState } from "react";

import {
  fetchGetV2AdminSitePolygonUUID,
  fetchGetV2AuditStatusId,
  fetchGetV2ProjectsUUIDSites
} from "@/generated/apiComponents";

interface SelectedItem {
  title: string | undefined;
  uuid: string | undefined;
  name: string | undefined;
  value: string | undefined;
  meta: string | undefined;
  status: string | undefined;
}

interface UseLoadEntityListParams {
  entityUuid: string;
  entityType: "sitePolygon" | "Site" | "Project";
}

interface EntityList {
  poly_name?: string | undefined;
  name?: string | undefined;
  uuid?: string | undefined;
  value?: string | undefined;
  meta?: string | undefined;
  status?: string | undefined;
}

const useLoadEntityList = ({ entityUuid, entityType }: UseLoadEntityListParams) => {
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const [entityList, setEntityList] = useState<EntityList[]>([]);

  const getNameProperty = (entityType: string): keyof EntityList => {
    switch (entityType) {
      case "sitePolygon":
        return "poly_name";
      case "Project":
        return "poly_name";
      case "Site":
        return "name";
      default:
        return "name";
    }
  };

  const unnamedTitleAndSort = (list: EntityList[], nameProperty: keyof EntityList) => {
    const unnamedItems = list?.map((item: EntityList) => {
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
    const fetchAction =
      entityType == "sitePolygon"
        ? fetchGetV2AdminSitePolygonUUID
        : entityType == "Project"
        ? fetchGetV2AuditStatusId
        : fetchGetV2ProjectsUUIDSites;
    const params = entityType == "sitePolygon" || entityType == "Site" ? { uuid: entityUuid } : { id: entityUuid };

    const res = await fetchAction({
      // @ts-ignore
      pathParams: params
    });
    const _entityList = (res as { data: EntityList[] }).data;
    const nameProperty = getNameProperty(entityType);
    const _list = unnamedTitleAndSort(_entityList, nameProperty);
    setEntityList(
      _list.map((item: EntityList) => ({
        title: item[nameProperty],
        uuid: item?.uuid,
        name: item[nameProperty],
        value: item?.uuid,
        meta: item?.status,
        status: item?.status
      }))
    );
    if (_list.length > 0) {
      if (selected?.title === undefined || !selected) {
        setSelected({
          title: _list[0]?.[nameProperty],
          uuid: _list[0]?.uuid,
          name: _list[0]?.[nameProperty],
          value: _list[0]?.uuid,
          meta: _list[0]?.status,
          status: _list[0]?.status
        });
      } else {
        const currentSelected = (res as { data: EntityList[] }).data.find(item => item?.uuid === selected?.uuid);
        setSelected({
          title: currentSelected?.[nameProperty],
          uuid: currentSelected?.uuid,
          name: currentSelected?.[nameProperty],
          value: currentSelected?.value,
          meta: currentSelected?.status,
          status: currentSelected?.status
        });
      }
    } else {
      setSelected(null);
    }
  };

  useEffect(() => {
    loadEntityList();
  }, [entityUuid]);

  return { entityList, selected, setSelected, loadEntityList };
};

export default useLoadEntityList;
