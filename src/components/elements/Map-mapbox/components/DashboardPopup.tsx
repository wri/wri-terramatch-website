import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Provider as ReduxProvider } from "react-redux";

import { LAYERS_NAMES } from "@/constants/layers";
import { CountriesProps } from "@/context/dashboard.provider";
import { useModalContext } from "@/context/modal.provider";
import TooltipGridMap from "@/pages/dashboard/components/TooltipGridMap";
import { usePopupData } from "@/pages/dashboard/hooks/usePopupsData";
import ApiSlice from "@/store/apiSlice";

import PopupMapImage from "./PopupMapImage";
const client = new QueryClient();

export const DashboardPopup = (event: any) => {
  const { popupType, popupData, items, label, isLoading, isoCountry, itemUuid, layerName, projectFullDto } =
    usePopupData(event);
  const { addPopupToMap, removePopupFromMap, setFilters, dashboardCountries, isDashboard } = event;
  const router = useRouter();
  const { closeModal } = useModalContext();

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
      const projectCountry = projectFullDto?.country;
      const selectedCountry = dashboardCountries?.find(
        (country: CountriesProps) => country.country_slug === projectCountry
      );

      if (selectedCountry) {
        setFilters((prevValues: any) => ({
          ...prevValues,
          uuid: itemUuid,
          country: selectedCountry
        }));

        router.push({
          pathname: "/dashboard",
          query: { country: projectCountry, uuid: itemUuid }
        });
      }
    }

    removePopupFromMap();

    if (isDashboard === "modal") {
      closeModal("modalExpand");
    }
  };
  return (
    <ReduxProvider store={ApiSlice.redux}>
      <QueryClientProvider client={client}>
        {popupType === "project" && layerName === LAYERS_NAMES.CENTROIDS ? (
          <PopupMapImage label={popupData?.label || "-"} items={items} learnMore={learnMoreEvent} />
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
