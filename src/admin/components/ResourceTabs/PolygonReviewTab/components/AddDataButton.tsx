import Button from "@/components/elements/Button/Button";
import Menu from "@/components/elements/Menu/Menu";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { useMapAreaContext } from "@/context/mapArea.provider";

export interface AddDataButtonProps {
  openFormModalHandlerAddPolygon: () => void;
  openFormModalHandlerUploadImages: () => void;
  classNameContent?: string;
}
const AddDataButton = (props: AddDataButtonProps) => {
  const { openFormModalHandlerAddPolygon, openFormModalHandlerUploadImages, classNameContent } = props;
  const context = useMapAreaContext();
  const { setIsUserDrawingEnabled } = context;
  const addMenuItems = [
    {
      id: "1",
      render: () => <Text variant="text-12-bold">Create Polygons</Text>,
      onClick: () => setIsUserDrawingEnabled(true)
    },
    {
      id: "2",
      render: () => <Text variant="text-12-bold">Add Polygon Data</Text>,
      onClick: openFormModalHandlerAddPolygon
    },
    {
      id: "3",
      render: () => <Text variant="text-12-bold">Upload Images</Text>,
      onClick: openFormModalHandlerUploadImages
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
        Add Data
      </Button>
    </Menu>
  );
};

export default AddDataButton;
