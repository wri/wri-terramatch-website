import { useT } from "@transifex/react";
import { FC, useCallback, useMemo, useState } from "react";

import ModalDelete from "@/redesignComponents/containers/Modal/ModalDelete";

import type { NurseryIndexRow } from "../../nurseryIndex.types";

export interface DeleteNurseryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nurseries: NurseryIndexRow[];
  onDelete?: () => void | Promise<void>;
}

const DeleteNursery: FC<DeleteNurseryProps> = ({ open, onOpenChange, nurseries, onDelete }) => {
  const t = useT();
  const [isSaving, setIsSaving] = useState(false);
  const items = useMemo(() => nurseries.map(({ id, name }) => ({ id, label: name ?? t("Nursery") })), [nurseries, t]);

  const handleDelete = useCallback(async () => {
    try {
      setIsSaving(true);
      await onDelete?.();
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }, [onDelete, onOpenChange]);

  return (
    <ModalDelete
      open={open}
      onOpenChange={onOpenChange}
      items={items}
      singular={{
        title: t("Delete nursery?"),
        description: t("will be permanently removed.")
      }}
      plural={{
        title: t("Delete nurseries?"),
        description: t("The following nurseries will be permanently removed.")
      }}
      isLoading={isSaving}
      onConfirm={handleDelete}
    />
  );
};

export default DeleteNursery;
