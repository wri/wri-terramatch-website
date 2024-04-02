import { useT } from "@transifex/react";

import Button from "../Button/Button";
interface DrawerFooterPolygonProps {
  onDelete: () => void;
  onCreate: () => void;
}
export const DrawerFooterPolygon = (props: DrawerFooterPolygonProps) => {
  const { onDelete, onCreate } = props;
  const t = useT();
  return (
    <div className="mt-auto flex items-center justify-end gap-5">
      <Button variant="semi-red" onClick={onDelete}>
        {t("Delete")}
      </Button>
      <Button variant="semi-black" onClick={onCreate}>
        {t("Create")}
      </Button>
    </div>
  );
};
