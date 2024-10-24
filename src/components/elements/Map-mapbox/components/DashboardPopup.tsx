import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { LAYERS_NAMES } from "@/constants/layers";
import {
  fetchGetV2DashboardPolygonDataUuid,
  fetchGetV2DashboardProjectDataUuid,
  fetchGetV2DashboardTotalSectionHeaderCountry
} from "@/generated/apiComponents";
import TooltipGridMap from "@/pages/dashboard/components/TooltipGridMap";
import { createQueryParams } from "@/utils/dashboardUtils";

const client = new QueryClient();

type Item = {
  id: string;
  title: string;
  value: string;
};

export const DashboardPopup = (event: any) => {
  const isoCountry = event?.feature?.properties?.iso;
  const itemUuid = event?.feature?.properties?.uuid;

  const { addPopupToMap, layerName } = event;

  const [items, setItems] = useState<Item[]>([]);
  const [label, setLabel] = useState<string>(event?.feature?.properties?.country);

  useEffect(() => {
    async function fetchCountryData() {
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
            value: ((response.total_enterprise_count || 0) + (response.total_non_profit_count || 0)).toString()
          },
          {
            id: "2",
            title: "Trees Planted",
            value: (response.total_trees_restored || 0).toString()
          },
          {
            id: "3",
            title: "Restoration Hectares",
            value: (response.total_hectares_restored || 0).toString()
          },
          {
            id: "4",
            title: "Jobs Created",
            value: (response.total_entries || 0).toString()
          }
        ];
        setItems(parsedItems);
        addPopupToMap();
      } else {
        console.error("No data returned from the API");
      }
    }

    async function fetchProjectData() {
      const response: any = await fetchGetV2DashboardProjectDataUuid({ pathParams: { uuid: itemUuid } });
      if (response) {
        const filteredItems = response.data
          .filter((item: any) => item.key !== "project_name")
          .map((item: any) => ({
            id: item.key,
            title: item.title,
            value: item.value
          }));

        const projectLabel = response.data.find((item: any) => item.key === "project_name")?.value;
        setLabel(projectLabel);
        setItems(filteredItems);
        addPopupToMap();
      }
    }
    async function fetchPolygonData() {
      const response: any = await fetchGetV2DashboardPolygonDataUuid({ pathParams: { uuid: itemUuid } });
      if (response) {
        const filteredItems = response.data
          .filter((item: any) => item.key !== "poly_name")
          .map((item: any) => ({
            id: item.key,
            title: item.title,
            value: item.value
          }));

        const projectLabel = response.data.find((item: any) => item.key === "poly_name")?.value;
        setLabel(projectLabel);
        setItems(filteredItems);
        addPopupToMap();
      }
    }

    if (isoCountry && layerName === LAYERS_NAMES.WORLD_COUNTRIES) {
      fetchCountryData();
    } else if (itemUuid && layerName === LAYERS_NAMES.CENTROIDS) {
      fetchProjectData();
    } else if (itemUuid && layerName === LAYERS_NAMES.POLYGON_GEOMETRY) {
      fetchPolygonData();
    }
  }, [isoCountry, layerName, itemUuid]);
  return (
    <QueryClientProvider client={client}>
      <TooltipGridMap label={label} learnMore={true} isoCountry={isoCountry} items={items} />
    </QueryClientProvider>
  );
};
