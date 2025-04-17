import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";

import { LAYERS_NAMES } from "@/constants/layers";
import { CountriesProps } from "@/context/dashboard.provider";
import TooltipGridMap from "@/pages/dashboard/components/TooltipGridMap";
import { usePopupData } from "@/pages/dashboard/hooks/usePopupsData";
import ApiSlice from "@/store/apiSlice";

import PopupMapImage from "./PopupMapImage";
const client = new QueryClient();

export const DashboardPopup = (event: any) => {
  const { popupType, popupData, items, label, isLoading, isoCountry, itemUuid, layerName } = usePopupData(event);
  const { addPopupToMap, removePopupFromMap, setFilters, dashboardCountries, isDashboard } = event;

  useEffect(() => {
    if (!isLoading && (items.length > 0 || popupData)) {
      addPopupToMap();
    }
  }, [isLoading, items, popupData, addPopupToMap]);

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
          <PopupMapImage
            label={popupData?.label || "-"}
            imageUrl={popupData?.imageUrl}
            items={items}
            learnMore={learnMoreEvent}
          />
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
