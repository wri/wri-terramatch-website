import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import React from "react";
import { twMerge } from "tailwind-merge";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { useGadmChoices } from "@/connections/Gadm";
import { LAYERS_NAMES } from "@/constants/layers";
import { useModalContext } from "@/context/modal.provider";
import { usePopupData } from "@/pages/dashboard/hooks/usePopupsData";

import type { MobilePopupData } from "../Map.d";

interface MobilePopupProps {
  event: MobilePopupData;
  onClose: () => void;
  variant: "mobile" | "desktop";
}

export const PopupMobile: React.FC<MobilePopupProps> = ({ event, onClose, variant = "desktop" }) => {
  const t = useT();
  const { items, label, itemUuid, layerName, projectFullDto, popupType } = usePopupData(event);
  const { setFilters, dashboardMode } = event;
  const countryChoices = useGadmChoices({ level: 0 });
  const router = useRouter();
  const { closeModal } = useModalContext();
  if (!items?.length) return null;

  const getLabelTitle = () => {
    if (popupType === "polygon") {
      return t("Polygon");
    } else if (popupType === "project") {
      return t("Project");
    }
    return t("Project");
  };

  const handleLearnMore = () => {
    if (layerName === LAYERS_NAMES.CENTROIDS && itemUuid != null) {
      const projectCountry = projectFullDto?.country;
      if (projectCountry != null) {
        setFilters?.(prev => ({
          ...prev,
          uuid: itemUuid,
          country: {
            country_slug: projectCountry,
            id: 0,
            data: {
              label: countryChoices?.find(choice => choice.id === projectCountry)?.name ?? projectCountry,
              icon: `/flags/${projectCountry}.svg`
            }
          }
        }));

        router.push({
          pathname: "/dashboard",
          query: { country: projectCountry, uuid: itemUuid }
        });
      }
    }

    onClose();

    if (dashboardMode === "modal") {
      closeModal("modalExpand");
    }
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
            {getLabelTitle()}
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
