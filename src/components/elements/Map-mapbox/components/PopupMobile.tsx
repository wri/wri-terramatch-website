import { useT } from "@transifex/react";
import React from "react";

import Text from "@/components/elements/Text/Text";
import { LAYERS_NAMES } from "@/constants/layers";
import { CountriesProps } from "@/context/dashboard.provider";
import { usePopupData } from "@/pages/dashboard/hooks/usePopupsData";

interface MobilePopupProps {
  event: any;
}

export const PopupMobile: React.FC<MobilePopupProps> = ({ event }) => {
  const t = useT();
  const { items, label, isoCountry, itemUuid, layerName } = usePopupData(event);
  const { setFilters, dashboardCountries } = event;

  const learnMore = () => {
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
  };
  return (
    <div className="shadow-lg fixed bottom-4 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 rounded-xl bg-white p-4">
      <div className="flex flex-col gap-2 p-2">
        <Text variant="text-12-bold" className="overflow-hidden leading-[normal] line-clamp-2">
          {t(label)}
        </Text>

        {items.map(item => (
          <div key={item.id} className="flex flex-col gap-0.5">
            <Text variant="text-12-light" className="leading-[normal]">
              {t(item.title)}
            </Text>
            <Text variant="text-12-semibold" className="leading-[normal]">
              {t(item.value)}
            </Text>
          </div>
        ))}

        <button onClick={learnMore}>
          <Text
            className="text-start text-primary underline underline-offset-1 hover:opacity-70"
            variant="text-12-semibold"
          >
            {t("View Project Page")}
          </Text>
        </button>
      </div>
    </div>
  );
};
