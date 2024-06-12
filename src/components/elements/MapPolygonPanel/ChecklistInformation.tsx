import { useT } from "@transifex/react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalWithMap from "@/components/extensive/Modal/ModalWithMap";
import { useModalContext } from "@/context/modal.provider";

import Button from "../Button/Button";
import Text from "../Text/Text";

const ChecklistInformation = () => {
  const { openModal, closeModal } = useModalContext();
  const t = useT();

  const openFormModalHandlerRequestPolygonSupport = () => {
    openModal(
      <ModalWithMap
        title={t("Request Support")}
        onClose={closeModal}
        primaryButtonText="Submit"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: closeModal }}
      ></ModalWithMap>
    );
  };
  return (
    <div className="text-white">
      <Text variant="text-14-bold">3 {t("out")} 14</Text>
      <Text variant="text-14-light">{t("Validation criteria are not met")}</Text>
      <Button variant="primary" className="mt-4" onClick={openFormModalHandlerRequestPolygonSupport}>
        {t("request support")}
      </Button>
      <div className="mt-3 grid gap-3">
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          {t("GeoJSON Format")}
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          {t("WGS84 Projection")}
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
          {t("Earth Location")}
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
          {t("Country")}
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          {t("Reasonable Size Self-Intersecting Topology")}
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
          {t("Overlapping Polygons")}
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          {t("Spike")}
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          {t("Polygon Integrity")}
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          {t("GeoJSON Format")}
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          {t("WGS84 Projection")}
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
          {t("Earth Location")}
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
          {t("Country")}
        </Text>
      </div>
    </div>
  );
};

export default ChecklistInformation;
