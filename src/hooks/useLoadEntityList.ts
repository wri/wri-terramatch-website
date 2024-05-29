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
  const unnamedTitleAndSort = (list: EntityList[], entity: string) => {
    const unnamedItems = list?.map((item: EntityList) => {
      if (!item.poly_name && (entity === "SitePolygon" || entity === "Project")) {
        return { ...item, poly_name: "Unnamed Polygon" };
      }
      if (!item.name && entity === "Site") {
        return { ...item, name: "Unnamed Site" };
      }
      return item;
    });

    return unnamedItems?.sort((a, b) => {
      const nameA = a.name || a.poly_name;
      const nameB = b.name || b.poly_name;
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
    const _list = unnamedTitleAndSort(_entityList, entityType);
    setEntityList(
      _list.map((item: EntityList) => ({
        title: item?.poly_name || item?.name,
        uuid: item?.uuid,
        name: item?.poly_name || item?.name,
        value: item?.uuid,
        meta: item?.status,
        status: item?.status
      }))
    );
    if (_list.length > 0) {
      if (selected?.title === undefined || !selected) {
        setSelected({
          title: _list[0]?.poly_name || _list[0]?.name,
          uuid: _list[0]?.uuid,
          name: _list[0]?.poly_name || _list[0]?.name,
          value: _list[0]?.uuid,
          meta: _list[0]?.status,
          status: _list[0]?.status
        });
      } else {
        const currentSelected = (res as { data: EntityList[] }).data.find(item => item?.uuid === selected?.uuid);
        setSelected({
          title: currentSelected?.poly_name || currentSelected?.name,
          uuid: currentSelected?.uuid,
          name: currentSelected?.poly_name || currentSelected?.name,
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
