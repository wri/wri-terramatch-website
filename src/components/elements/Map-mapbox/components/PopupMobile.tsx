import { useT } from "@transifex/react";
import React from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { LAYERS_NAMES } from "@/constants/layers";
import { CountriesProps } from "@/context/dashboard.provider";
import { usePopupData } from "@/pages/dashboard/hooks/usePopupsData";

interface MobilePopupProps {
  event: any;
  onClose: () => void;
}

export const PopupMobile: React.FC<MobilePopupProps> = ({ event, onClose }) => {
  const t = useT();
  const { items, label, isoCountry, itemUuid, layerName } = usePopupData(event);
  const { setFilters, dashboardCountries } = event;

  if (!items.length) return null;

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
    onClose();
  };
  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 rounded-xl bg-white p-3 shadow-monitored">
      <div className="relative w-full">
        <button
          onClick={onClose}
          className="absolute -right-4 -top-4 z-10 rounded-full border border-neutral-600 bg-white p-1.5 text-neutral-600 hover:border-primary hover:text-primary"
        >
          <Icon name={IconNames.CLEAR} className="h-2.5 w-2.5" />
        </button>
      </div>
      <div className="flex flex-col gap-2 p-2">
        <Text variant="text-12-bold" className="overflow-hidden leading-[normal] line-clamp-2">
          {t(label)}
        </Text>

        {items.length > 0 && (
          <>
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
            {layerName === LAYERS_NAMES.CENTROIDS && (
              <button onClick={learnMore}>
                <Text
                  className="text-start text-primary underline underline-offset-1 hover:opacity-70"
                  variant="text-12-semibold"
                >
                  {t("View Project Page")}
                </Text>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
