import { useT } from "@transifex/react";
import { FC, useCallback, useMemo, useState } from "react";

import ModalDelete from "@/redesignComponents/containers/Modal/ModalDelete";

import type { SiteIndexSite } from "../siteIndex.types";

export interface DeleteSiteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sites: SiteIndexSite[];
  onDelete?: () => void | Promise<void>;
}

const DeleteSite: FC<DeleteSiteProps> = ({ open, onOpenChange, sites, onDelete }) => {
  const t = useT();
  const [isSaving, setIsSaving] = useState(false);
  const items = useMemo(() => sites.map(({ id, name }) => ({ id, label: name })), [sites]);

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
        title: t("Delete site?"),
        description: t("will be permanently removed.")
      }}
      plural={{
        title: t("Delete sites?"),
        description: t("The following sites will be permanently removed.")
      }}
      isLoading={isSaving}
      onConfirm={handleDelete}
    />
  );
};

export default DeleteSite;
