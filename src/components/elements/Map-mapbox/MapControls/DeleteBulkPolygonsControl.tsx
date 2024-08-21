import { useT } from "@transifex/react";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

const DeleteBulkPolygonsControl = () => {
  const t = useT();

  return (
    <div className="flex-col items-center gap-1">
      <div className="rounded-lg bg-[#ffffff26] bg-white p-3 text-center text-white">
        <Text variant="text-10" className="text-black">
          {t("Click below to delete the selected polygons")}
        </Text>
        <Button
          variant="text"
          className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-red bg-red p-2 hover:border-white"
          onClick={() => {}}
        >
          {t("Delete Polygons")}
        </Button>
      </div>
    </div>
  );
};

export default DeleteBulkPolygonsControl;
