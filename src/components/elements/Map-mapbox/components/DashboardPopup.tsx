import { useRouter } from "next/router";
import { Provider as ReduxProvider } from "react-redux";

import { LAYERS_NAMES } from "@/constants/layers";
import { CountriesProps } from "@/context/dashboard.provider";
import { useModalContext } from "@/context/modal.provider";
import TooltipGridMap from "@/pages/dashboard/components/TooltipGridMap";
import { usePopupData } from "@/pages/dashboard/hooks/usePopupsData";
import ApiSlice from "@/store/apiSlice";

import type { PopupComponentProps } from "../Map.d";
import PopupMapImage from "./PopupMapImage";

export const DashboardPopup = (event: PopupComponentProps) => {
  const { popupType, popupData, items, label, isoCountry, itemUuid, layerName, projectFullDto } = usePopupData(event);
  const { popup, setFilters, dashboardCountries, dashboardMode } = event;
  const router = useRouter();
  const { closeModal } = useModalContext();

  const learnMoreEvent = () => {
    if (itemUuid != null && layerName === LAYERS_NAMES.CENTROIDS) {
      const projectCountry = projectFullDto?.country;
      const selectedCountry = dashboardCountries?.find(
        (country: CountriesProps) => country.country_slug === projectCountry
      );

      if (selectedCountry != null) {
        setFilters?.(prev => ({
          ...prev,
          uuid: itemUuid,
          country: selectedCountry
        }));

        router.push({
          pathname: "/dashboard",
          query: { country: projectCountry, uuid: itemUuid }
        });
      }
    }

    popup?.remove();

    if (dashboardMode === "modal") {
      closeModal("modalExpand");
    }
  };
  return (
    <ReduxProvider store={ApiSlice.redux}>
      {popupType === "project" && layerName === LAYERS_NAMES.CENTROIDS ? (
        <PopupMapImage label={popupData?.label ?? "-"} items={items} learnMore={learnMoreEvent} />
      ) : (
        <TooltipGridMap
          label={label}
          learnMore={
            layerName !== LAYERS_NAMES.POLYGON_GEOMETRY && dashboardMode === "dashboard" ? learnMoreEvent : null
          }
          isoCountry={isoCountry}
          items={items}
        />
      )}
    </ReduxProvider>
  );
};
