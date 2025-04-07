import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Provider as ReduxProvider } from "react-redux";

import { LAYERS_NAMES } from "@/constants/layers";
import { CountriesProps } from "@/context/dashboard.provider";
import {
  fetchGetV2DashboardPolygonDataUuid,
  fetchGetV2DashboardProjectDataUuid,
  fetchGetV2DashboardTotalSectionHeaderCountry
} from "@/generated/apiComponents";
import TooltipGridMap from "@/pages/dashboard/components/TooltipGridMap";
import ApiSlice from "@/store/apiSlice";
import { createQueryParams } from "@/utils/dashboardUtils";
import Log from "@/utils/log";

import PopupMapImage from "./PopupMapImage";
const client = new QueryClient();

type Item = {
  id: string;
  title: string;
  value: string;
};

export const DashboardPopup = (event: any) => {
  const isoCountry = event?.feature?.properties?.iso;
  const itemUuid = event?.feature?.properties?.uuid;
  const { addPopupToMap, layerName, setFilters, dashboardCountries, removePopupFromMap, isDashboard } = event;
  const [popupType, setPopupType] = useState<"country" | "project" | "polygon" | null>(null);
  const [popupData, setPopupData] = useState<any>(null);
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
        addPopupToMap();
      } else {
        Log.error("No data returned from the API");
      }
    }

    async function fetchProjectData() {
      const response: any = await fetchGetV2DashboardProjectDataUuid({ pathParams: { uuid: itemUuid } });
      if (response) {
        const label = response.data.find((item: any) => item.key === "project_name")?.value;
        const organization = response.data.find((item: any) => item.key === "organisation")?.value;
        const hectares = response.data.find((item: any) => item.key === "hectares_under_restoration")?.value;

        setPopupType("project");
        setPopupData({
          label,
          organization,
          hectares,
          imageUrl: response.data.find((item: any) => item.key === "cover_image")?.value ?? null
        });

        const filteredItems = response.data
          .filter((item: any) => item.key !== "project_name" && item.key !== "cover_image")
          .map((item: any) => ({
            id: item.key,
            title: item.title === "No. of Site - Polygons" ? "Number of Site - Polygons" : item.title,
            value: item.value
          }));

        setLabel(label);
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
            value: (item.value ?? "-").toLocaleString()
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isoCountry, layerName, itemUuid]);
  const learnMoreEvent = () => {
    if (isoCountry && layerName === LAYERS_NAMES.WORLD_COUNTRIES) {
      const selectedCountry = dashboardCountries?.find(
        (country: CountriesProps) => country.country_slug === isoCountry
      );
      if (selectedCountry) {
        setFilters((prevValues: any) => ({
          ...prevValues,
          uuid: "",
          country: selectedCountry
        }));
      }
    } else if (itemUuid && layerName === LAYERS_NAMES.CENTROIDS) {
      setFilters((prevValues: any) => ({ ...prevValues, uuid: itemUuid }));
    }
    removePopupFromMap();
  };
  return (
    <ReduxProvider store={ApiSlice.redux}>
      <QueryClientProvider client={client}>
        {popupType === "project" && layerName === LAYERS_NAMES.CENTROIDS ? (
          <PopupMapImage label={popupData?.label || "-"} imageUrl={popupData?.imageUrl} items={items} />
        ) : (
          <TooltipGridMap
            label={label}
            learnMore={
              layerName !== LAYERS_NAMES.POLYGON_GEOMETRY && isDashboard === "dashboard" ? learnMoreEvent : null
            }
            isoCountry={isoCountry}
            items={items}
          />
        )}
      </QueryClientProvider>
    </ReduxProvider>
  );
};
