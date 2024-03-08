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
      <Button variant="semiRed" onClick={onDelete}>
        {t("Delete")}
      </Button>
      <Button variant="semiBlack" onClick={onCreate}>
        {t("Create")}
      </Button>
    </div>
  );
};
