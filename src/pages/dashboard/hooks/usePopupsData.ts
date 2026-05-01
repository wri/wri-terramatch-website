import { GeoJSONFeature } from "mapbox-gl";
import { useEffect, useMemo, useState } from "react";

import { useDashboardProject } from "@/connections/DashboardEntity";
import { useSitePolygons } from "@/connections/SitePolygons";
import { LAYERS_NAMES } from "@/constants/layers";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import Log from "@/utils/log";

type PopupEvent = { feature?: GeoJSONFeature; layerName?: string };

type Item = {
  id: string;
  title: string;
  value: string;
};

export function usePopupData(event: PopupEvent) {
  const properties = event?.feature?.properties ?? {};
  const isoCountry = typeof properties.iso === "string" ? properties.iso : undefined;
  const itemUuid = typeof properties.uuid === "string" ? properties.uuid : undefined;
  const { layerName } = event;

  const [popupType, setPopupType] = useState<"project" | "polygon" | null>(null);
  const [popupData, setPopupData] = useState<{ label?: string; organization?: string; hectares?: string } | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [label, setLabel] = useState<string>(typeof properties.country === "string" ? properties.country : "");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [projectLoaded, { data: projectFullDto }] = useDashboardProject({
    id: itemUuid != null && layerName === LAYERS_NAMES.CENTROIDS ? itemUuid : undefined
  });

  const [polygonDataLoaded, { data: polygonDataArray }] = useSitePolygons({
    filter: {
      "polygonUuid[]": itemUuid != null && layerName === LAYERS_NAMES.POLYGON_GEOMETRY ? [itemUuid] : []
    },
    enabled: itemUuid != null && layerName === LAYERS_NAMES.POLYGON_GEOMETRY,
    pageSize: 1,
    pageNumber: 1
  });

  const polygonData = useMemo<SitePolygonLightDto | undefined>(() => {
    return polygonDataArray?.[0];
  }, [polygonDataArray]);

  const createProjectDataFromEntity = (
    projectFullDto:
      | {
          name?: string | null;
          organisationName?: string | null;
          totalHectaresRestoredSum?: number;
        }
      | null
      | undefined
  ) => {
    if (projectFullDto == null) return null;

    const data = [
      {
        key: "project_name",
        title: "title",
        value: projectFullDto.name ?? "Unknown Project"
      },
      {
        key: "organizations",
        title: "Organization",
        value: projectFullDto.organisationName ?? "Unknown Organization"
      }
    ];

    if (projectFullDto.totalHectaresRestoredSum !== undefined) {
      data.push({
        key: "total_hectares_restored",
        title: "Total Hectares Restored",
        value: projectFullDto.totalHectaresRestoredSum.toFixed(0)
      });
    }
    return { data };
  };

  useEffect(() => {
    async function fetchProjectData() {
      setIsLoading(true);
      try {
        if (projectFullDto && projectLoaded) {
          const entityData = createProjectDataFromEntity(projectFullDto);

          if (entityData) {
            const label = projectFullDto.name ?? "Unknown Project";
            const organization = projectFullDto.organisationName ?? undefined;
            const hectares = projectFullDto.totalHectaresRestoredSum?.toString();

            setPopupType("project");
            setPopupData({
              label,
              organization,
              hectares
            });

            const filteredItems = entityData.data
              .filter(item => item.key !== "project_name" && item.key !== "cover_image")
              .map(item => ({
                id: item.key,
                title: item.title === "No. of Site - Polygons" ? "Number of Site - Polygons" : item.title,
                value: item.value?.toString() ?? "-"
              }));

            setLabel(label);
            setItems(filteredItems);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        Log.error("Error fetching project data", error);
      } finally {
        setIsLoading(false);
      }
    }

    function transformPolygonDataToItems(polygon: SitePolygonLightDto): { items: Item[]; label: string } {
      const formatDate = (dateString: string | null | undefined): string => {
        if (dateString == null) {
          return "-";
        }
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const items: Item[] = [];

      const projectName = polygon.projectName ?? polygon.projectShortName;
      if (projectName != null) {
        items.push({
          id: "project_name",
          title: "Project",
          value: projectName
        });
      }

      if (polygon.siteName != null) {
        items.push({
          id: "siteName",
          title: "Site",
          value: polygon.siteName
        });
      }

      if (polygon.numTrees != null) {
        items.push({
          id: "numTrees",
          title: "Number of trees",
          value: polygon.numTrees.toString()
        });
      }

      if (polygon.plantStart != null) {
        items.push({
          id: "plantStart",
          title: "Plant Start Date",
          value: formatDate(polygon.plantStart)
        });
      }

      if (polygon.status != null) {
        items.push({
          id: "status",
          title: "Status",
          value: polygon.status
        });
      }

      return {
        items,
        label: polygon.name ?? "Unnamed Polygon"
      };
    }

    function processPolygonData() {
      if (polygonDataLoaded && polygonData != null) {
        setIsLoading(false);
        const { items: transformedItems, label: polygonLabel } = transformPolygonDataToItems(polygonData);
        setLabel(polygonLabel);
        setItems(transformedItems);
        setPopupType("polygon");
      } else if (itemUuid != null && layerName === LAYERS_NAMES.POLYGON_GEOMETRY && !polygonDataLoaded) {
        setIsLoading(true);
      }
    }

    setItems([]);
    if (itemUuid != null && layerName === LAYERS_NAMES.CENTROIDS) {
      fetchProjectData();
    } else if (itemUuid != null && layerName === LAYERS_NAMES.POLYGON_GEOMETRY) {
      processPolygonData();
    }
  }, [layerName, itemUuid, projectFullDto, projectLoaded, polygonDataLoaded, polygonData]);

  return {
    popupType,
    popupData,
    items,
    label,
    isLoading,
    isoCountry,
    itemUuid,
    layerName,
    projectFullDto,
    projectLoaded
  };
}
