import { useT } from "@transifex/react";
import React from "react";
import { twMerge } from "tailwind-merge";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { LAYERS_NAMES } from "@/constants/layers";
import { CountriesProps } from "@/context/dashboard.provider";
import { usePopupData } from "@/pages/dashboard/hooks/usePopupsData";

interface MobilePopupProps {
  event: {
    setFilters: (fn: (prev: any) => any) => void;
    dashboardCountries?: CountriesProps[];
    [key: string]: any;
  };
  onClose: () => void;
  variant: "mobile" | "desktop";
}

export const PopupMobile: React.FC<MobilePopupProps> = ({ event, onClose, variant = "desktop" }) => {
  const t = useT();
  const { items, label, isoCountry, itemUuid, layerName } = usePopupData(event);
  const { setFilters, dashboardCountries } = event;
  if (!items?.length) return null;

  const handleLearnMore = () => {
    if (layerName === LAYERS_NAMES.WORLD_COUNTRIES && isoCountry) {
      const selectedCountry = dashboardCountries?.find(country => country.country_slug === isoCountry);
      if (selectedCountry) {
        setFilters(prev => ({
          ...prev,
          uuid: "",
          country: selectedCountry
        }));
      }
    } else if (layerName === LAYERS_NAMES.CENTROIDS && itemUuid) {
      setFilters(prev => ({ ...prev, uuid: itemUuid }));
    }

    onClose();
  };

  const classNamesVariants = {
    desktop: {
      container: "absolute top-6 left-5 z-50 w-[90vw] max-w-[14rem]"
    },
    mobile: {
      container:
        "fixed bottom-4 left-1/2 z-50 w-[90vw] max-w-md -translate-x-1/2 rounded-xl bg-white p-3 shadow-monitored"
    }
  };

  return (
    <div className={twMerge("rounded-xl bg-white p-3 shadow-monitored", classNamesVariants[variant].container)}>
      <div className="max-w w-full">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full border border-neutral-600 bg-white p-1.5 text-neutral-600 hover:border-primary hover:text-primary"
          aria-label={t("Close popup")}
        >
          <Icon name={IconNames.CLEAR} className="h-2.5 w-2.5" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <Text variant="text-12-light" className="leading-[normal] text-darkCustom">
            {t("Project")}
          </Text>
          <Text variant="text-12-bold" className="max-w-[95%] overflow-hidden leading-[normal]">
            {t(label)}
          </Text>
        </div>

        {items.map(item => (
          <div key={item.id} className="flex flex-col gap-0.5">
            <Text variant="text-12-light" className="leading-[normal] text-darkCustom">
              {t(item.title)}
            </Text>
            <Text variant="text-12-semibold" className="leading-[normal]">
              {t(item.value)}
            </Text>
          </div>
        ))}

        {layerName === LAYERS_NAMES.CENTROIDS && (
          <button onClick={handleLearnMore}>
            <Text
              className="text-start text-blue-50 underline underline-offset-1 hover:opacity-70"
              variant="text-12-semibold"
            >
              {t("View Project Page")}
            </Text>
          </button>
        )}
      </div>
    </div>
  );
};
