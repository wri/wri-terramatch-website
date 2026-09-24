import { useT } from "@transifex/react";
import { FC, useCallback, useMemo } from "react";

import ModalDelete from "@/redesignComponents/containers/Modal/ModalDelete";

import type { PolygonTableRow } from "../PolygonTableRow";

export interface DeletePolygonProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: PolygonTableRow[];
  onDelete?: () => void | Promise<void>;
  modal?: boolean;
  restoreFocus?: boolean;
}
const DeletePolygon: FC<DeletePolygonProps> = ({
  open,
  onOpenChange,
  polygons,
  onDelete,
  modal = true,
  restoreFocus = true
}) => {
  const t = useT();

  const handleDelete = useCallback(() => {
    void onDelete?.();
    onOpenChange(false);
  }, [onDelete, onOpenChange]);

  const items = useMemo(() => polygons.map(({ id, polygonName }) => ({ id, label: polygonName })), [polygons]);

  return (
    <ModalDelete
      modal={modal}
      restoreFocus={restoreFocus}
      open={open}
      onOpenChange={onOpenChange}
      items={items}
      singular={{
        title: t("Delete polygon?"),
        description: t("will be permanently removed from this site.")
      }}
      plural={{
        title: t("Delete polygons?"),
        description: t("The following polygons will be permanently removed from this site.")
      }}
      onConfirm={handleDelete}
    />
  );
};

export default DeletePolygon;
