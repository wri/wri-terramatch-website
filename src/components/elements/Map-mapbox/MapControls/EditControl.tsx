import React, { useEffect } from "react";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

const EditControl = ({ onClick, onSave, onCancel }: { onClick?: any; onSave?: any; onCancel?: any }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  useEffect(() => {
    return () => {
      onCancel();
    };
  }, []);
  return (
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
          Edit Polygon
        </Text>
      </Button>
      {isEditing && (
        <div className="flex w-full items-center gap-1">
          <Button onClick={onSave} className="w-full">
            <Text variant="text-12-bold" className="leading-[normal]">
              Save
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
              Cancel
            </Text>
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditControl;
