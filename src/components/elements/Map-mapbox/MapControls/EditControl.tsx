import { useT } from "@transifex/react";
import React, { useContext } from "react";
import { When } from "react-if";

import { useMapAreaContext } from "@/context/mapArea.provider";
import { useOnMount } from "@/hooks/useOnMount";

import Button from "../../Button/Button";
import Text from "../../Text/Text";
import { MapEditingContext } from "../Map";

const EditControl = ({ onClick, onSave, onCancel }: { onClick?: any; onSave?: any; onCancel?: any }) => {
  const t = useT();
  const { selectedPolyVersion } = useMapAreaContext();
  const { isEditing, setIsEditing } = useContext(MapEditingContext);

  useOnMount(() => {
    return () => {
      onCancel();
    };
  });

  const handleSaveButton = () => {
    onSave();
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    onClick();
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    onCancel();
  };
  return (
    <When condition={!selectedPolyVersion?.uuid}>
      <div className="flex w-[160px] flex-col items-center gap-1">
        <Button
          id="buttonEditPolygon"
          variant="white"
          className="w-full rounded border border-neutral-175 py-2"
          onClick={handleEditClick}
        >
          <Text variant="text-12-bold" className="leading-[normal] text-black">
            {t("Edit Polygon")}
          </Text>
        </Button>
        <When condition={isEditing}>
          <div className="flex w-full items-center gap-1">
            <Button onClick={handleSaveButton} className="w-full">
              <Text variant="text-12-bold" className="leading-[normal]">
                {t("Save")}
              </Text>
            </Button>
            <Button variant="sky-page-admin" className="w-full" onClick={handleCancelClick}>
              <Text variant="text-12-bold" className="leading-[normal]">
                {t("Cancel")}
              </Text>
            </Button>
          </div>
        </When>
      </div>
    </When>
  );
};

export default EditControl;
