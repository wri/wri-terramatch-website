import { useT } from "@transifex/react";
import { useState } from "react";

import IconButton from "@/components/elements/IconButton/IconButton";
import ControlButtonsGroup from "@/components/elements/Map-mapbox/components/ControlButtonsGroup";
import ControlDivider from "@/components/elements/Map-mapbox/components/ControlDivider";
import { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { useModalContext } from "@/context/modal.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { fetchDeleteV2TerrafundProjectPolygonUuid } from "@/generated/apiComponents";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

interface PolygonModifierProps {
  polygonFromMap: { uuid: string; isOpen: boolean } | undefined;
  onClick?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

const PolygonModifier = ({ polygonFromMap, onClick, onSave, onCancel }: PolygonModifierProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { openModal, closeModal } = useModalContext();
  const contextSite = useSitePolygonData();
  const reloadSiteData = contextSite?.reloadSiteData;
  const t = useT();

  const handleSave = () => {
    onSave?.();
    setIsEditing(false);
    reloadSiteData?.();
  };

  const handleDelete = async () => {
    if (polygonFromMap?.uuid) {
      await fetchDeleteV2TerrafundProjectPolygonUuid({ pathParams: { uuid: polygonFromMap.uuid } });
      reloadSiteData?.();
    }
  };

  const openDeleteConfirmation = () => {
    openModal(
      <ModalConfirm
        title={t("Confirm Polygon Deletion")}
        content={t("Do you want to delete this polygon?")}
        onClose={closeModal}
        onConfirm={() => {
          handleDelete();
          closeModal();
        }}
      />
    );
  };

  return (
    <ControlButtonsGroup direction="col" className="z-10 w-auto">
      <IconButton
        iconProps={{ name: IconNames.EDIT, width: 24, height: 24 }}
        onClick={() => {
          setIsEditing(true);
          onClick?.();
        }}
        className="rounded-b-none rounded-t-lg p-[10px]"
        aria-label="Edit Polygon"
      />
      {isEditing && (
        <div className="flex w-full items-center gap-1">
          <Button onClick={handleSave} className="w-full">
            <Text variant="text-12-bold" className="leading-[normal]">
              {t("Save")}
            </Text>
          </Button>
          <Button
            variant="sky-page-admin"
            className="w-full"
            onClick={() => {
              setIsEditing(false);
              onCancel?.();
            }}
          >
            <Text variant="text-12-bold" className="leading-[normal]">
              {t("Cancel")}
            </Text>
          </Button>
        </div>
      )}
      <ControlDivider direction="horizontal" className="m-0 w-auto bg-neutral-200" />
      <IconButton
        iconProps={{ name: IconNames.TRASH, width: 24, height: 24 }}
        onClick={openDeleteConfirmation}
        className="rounded-t-none rounded-b-lg p-[10px]"
        aria-label="Delete Polygon"
      />
    </ControlButtonsGroup>
  );
};

export default PolygonModifier;
