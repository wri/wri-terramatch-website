import { useT } from "@transifex/react";
import React, { useEffect } from "react";
import { When } from "react-if";

import { useMapAreaContext } from "@/context/mapArea.provider";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

const EditControl = ({ onClick, onSave, onCancel }: { onClick?: any; onSave?: any; onCancel?: any }) => {
  const t = useT();
  const [isEditing, setIsEditing] = React.useState(false);
  const { selectedPolyVersion } = useMapAreaContext();
  useEffect(() => {
    return () => {
      onCancel();
    };
  }, []);
  const handleSaveButton = () => {
    onSave();
    setIsEditing(false);
  };
  return (
    <When condition={!selectedPolyVersion?.uuid}>
      <div className="flex w-[160px] flex-col items-center gap-1">
        <Button
          id="buttonEditPolygon"
          variant="white"
          className="w-full py-2"
          onClick={() => {
            setIsEditing(true);
            onClick();
          }}
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
            <Button
              variant="sky-page-admin"
              className="w-full"
              onClick={() => {
                setIsEditing(false);
                onCancel();
              }}
            >
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
