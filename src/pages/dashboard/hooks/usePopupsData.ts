import { useEffect, useState } from "react";

import { useFullProject } from "@/connections/Entity";
import { LAYERS_NAMES } from "@/constants/layers";
import {
  fetchGetV2DashboardPolygonDataUuid,
  fetchGetV2DashboardTotalSectionHeaderCountry
} from "@/generated/apiComponents";
import { createQueryParams } from "@/utils/dashboardUtils";
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

  const [projectLoaded, { entity: projectFullDto }] = useFullProject({
    uuid: itemUuid && layerName === LAYERS_NAMES.CENTROIDS ? itemUuid : null
  });

  const createProjectDataFromEntity = (projectFullDto: any) => {
    if (!projectFullDto) return null;

    const data = [
      {
        key: "project_name",
        title: "title",
        value: projectFullDto.name || "Unknown Project"
      },
      {
        key: "organizations",
        title: "Organization",
        value: projectFullDto.organisationName || "Unknown Organization"
      }
    ];

    if (projectFullDto.totalHectaresRestoredSum !== undefined) {
      data.push({
        key: "total_hectares_restored",
        title: "Total Hectares Restored",
        value: projectFullDto.totalHectaresRestoredSum
      });
    }
    return { data };
  };

  useEffect(() => {
    async function fetchCountryData() {
      setIsLoading(true);
      try {
        const parsedFilters = {
          programmes: [],
          country: isoCountry,
          "organisations.type": [],
          landscapes: [],
          uuid: ""
        };
        const queryParams: any = createQueryParams(parsedFilters);
        const response: any = await fetchGetV2DashboardTotalSectionHeaderCountry({ queryParams });
        if (response) {
          const parsedItems = [
            {
              id: "1",
              title: "No. of Projects",
              value: ((response.total_enterprise_count || 0) + (response.total_non_profit_count || 0)).toLocaleString()
            },
            {
              id: "2",
              title: "Trees Planted",
              value: (response.total_trees_restored || 0).toLocaleString()
            },
            {
              id: "3",
              title: "Restoration Hectares",
              value: (response.total_hectares_restored || 0).toLocaleString()
            },
            {
              id: "4",
              title: "Jobs Created",
              value: (response.total_entries || 0).toLocaleString()
            }
          ];
          setItems(parsedItems);
          setPopupType("country");
        } else {
          Log.error("No data returned from the API");
        }
      } catch (error) {
        Log.error("Error fetching country data", error);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchProjectData() {
      setIsLoading(true);
      try {
        if (projectFullDto && projectLoaded) {
          const entityData = createProjectDataFromEntity(projectFullDto);

          if (entityData) {
            const label = projectFullDto.name || "Unknown Project";
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
                value: item.value?.toString() || "-"
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
    if (isoCountry && layerName === LAYERS_NAMES.WORLD_COUNTRIES) {
      fetchCountryData();
    } else if (itemUuid && layerName === LAYERS_NAMES.CENTROIDS) {
      fetchProjectData();
    } else if (itemUuid && layerName === LAYERS_NAMES.POLYGON_GEOMETRY) {
      fetchPolygonData();
    }
  }, [isoCountry, layerName, itemUuid, projectFullDto, projectLoaded]);

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
