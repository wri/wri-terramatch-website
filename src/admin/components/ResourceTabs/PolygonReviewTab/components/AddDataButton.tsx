import { useT } from "@transifex/react";

import Button from "@/components/elements/Button/Button";
import Menu from "@/components/elements/Menu/Menu";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { useMapAreaContext } from "@/context/mapArea.provider";

export interface AddDataButtonProps {
  openFormModalHandlerAddPolygon: () => void;
  openFormModalHandlerUploadImages: () => void;
  openFormModalHandlerAddPolygons?: () => void;
  classNameContent?: string;
}
const AddDataButton = (props: AddDataButtonProps) => {
  const { openFormModalHandlerAddPolygon, classNameContent, openFormModalHandlerAddPolygons } = props;
  const context = useMapAreaContext();
  const t = useT();
  const { setIsUserDrawingEnabled, setSelectedPolygonsInCheckbox } = context;
  const addMenuItems = [
    {
      id: "1",
      render: () => <Text variant="text-12-bold">{t("Draw Polygon on Map")}</Text>,
      onClick: () => {
        setIsUserDrawingEnabled(true);
        setSelectedPolygonsInCheckbox([]);
      }
    },
    {
      id: "2",
      render: () => <Text variant="text-12-bold">{t("Add Polygon Data")}</Text>,
      onClick: () => {
        openFormModalHandlerAddPolygon();
        setSelectedPolygonsInCheckbox([]);
      }
    },
    {
      id: "3",
      render: () => <Text variant="text-12-bold">{t("Update All Polygons")}</Text>,
      onClick: () => {
        openFormModalHandlerAddPolygons?.();
        setSelectedPolygonsInCheckbox([]);
      }
    }
  ];
  return (
    <Menu menu={addMenuItems} className={classNameContent}>
      <Button
        variant="sky-page-admin"
        className="h-fit w-full whitespace-nowrap"
        iconProps={{
          className: "w-4 h-4",
          name: IconNames.PLUS_PA
        }}
      >
        {t("Add Data")}
      </Button>
    </Menu>
  );
};

export default AddDataButton;
