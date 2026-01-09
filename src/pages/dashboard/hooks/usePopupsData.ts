import { useEffect, useState } from "react";

import { useDashboardProject } from "@/connections/DashboardEntity";
import { useTotalSectionHeader } from "@/connections/DashboardTotalSectionHeaders";
import { LAYERS_NAMES } from "@/constants/layers";
import { fetchGetV2DashboardPolygonDataUuid } from "@/generated/apiComponents";
import Log from "@/utils/log";

type Item = {
  id: string;
  title: string;
  value: string;
};

export function usePopupData(event: any) {
  const isoCountry = event?.feature?.properties?.iso;
  const itemUuid = event?.feature?.properties?.uuid;
  const { layerName } = event;

  const [popupType, setPopupType] = useState<"country" | "project" | "polygon" | null>(null);
  const [popupData, setPopupData] = useState<any>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [label, setLabel] = useState<string>(event?.feature?.properties?.country);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [projectLoaded, { data: projectFullDto }] = useDashboardProject({
    id: itemUuid && layerName === LAYERS_NAMES.CENTROIDS ? itemUuid : null
  });

  // Fetch country data using v3 connection
  const [countryDataLoaded, { data: countryData }] = useTotalSectionHeader({
    filter: {
      country: isoCountry != null && layerName === LAYERS_NAMES.WORLD_COUNTRIES ? isoCountry : undefined
    }
  });

  const createProjectDataFromEntity = (projectFullDto: any) => {
    if (!projectFullDto) return null;

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

  // Process country data from v3 connection
  useEffect(() => {
    if (countryDataLoaded && countryData != null && layerName === LAYERS_NAMES.WORLD_COUNTRIES) {
      setIsLoading(false);
      const parsedItems = [
        {
          id: "1",
          title: "No. of Projects",
          value: ((countryData.totalEnterpriseCount ?? 0) + (countryData.totalNonProfitCount ?? 0)).toLocaleString()
        },
        {
          id: "2",
          title: "Trees Planted",
          value: (countryData.totalTreesRestored ?? 0).toLocaleString()
        },
        {
          id: "3",
          title: "Restoration Hectares",
          value: (countryData.totalHectaresRestored ?? 0).toLocaleString()
        },
        {
          id: "4",
          title: "Jobs Created",
          value: (countryData.totalEntries ?? 0).toLocaleString()
        }
      ];
      setItems(parsedItems);
      setPopupType("country");
    } else if (isoCountry != null && layerName === LAYERS_NAMES.WORLD_COUNTRIES && !countryDataLoaded) {
      setIsLoading(true);
    }
  }, [countryDataLoaded, countryData, isoCountry, layerName]);

  useEffect(() => {
    async function fetchProjectData() {
      setIsLoading(true);
      try {
        if (projectFullDto && projectLoaded) {
          const entityData = createProjectDataFromEntity(projectFullDto);

          if (entityData) {
            const label = projectFullDto.name ?? "Unknown Project";
            const organization = projectFullDto.organisationName;
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

    async function fetchPolygonData() {
      setIsLoading(true);
      try {
        const response: any = await fetchGetV2DashboardPolygonDataUuid({ pathParams: { uuid: itemUuid } });
        if (response) {
          const filteredItems = response.data
            .filter((item: any) => item.key !== "poly_name")
            .map((item: any) => ({
              id: item.key,
              title: item.title,
              value: (item.value ?? "-").toLocaleString()
            }));

          const projectLabel = response.data.find((item: any) => item.key === "poly_name")?.value;
          setLabel(projectLabel);
          setItems(filteredItems);
          setPopupType("polygon");
        }
      } catch (error) {
        Log.error("Error fetching polygon data", error);
      } finally {
        setIsLoading(false);
      }
    }

    setItems([]);
    if (itemUuid && layerName === LAYERS_NAMES.CENTROIDS) {
      fetchProjectData();
    } else if (itemUuid && layerName === LAYERS_NAMES.POLYGON_GEOMETRY) {
      fetchPolygonData();
    }
  }, [layerName, itemUuid, projectFullDto, projectLoaded]);

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
