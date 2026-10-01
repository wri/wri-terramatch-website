import { useT } from "@transifex/react";
import { FC, useCallback, useMemo, useState } from "react";

import ModalSubmit from "@/redesignComponents/containers/Modal/ModalSubmit";

import type { SiteIndexSite } from "../siteIndex.types";

export interface SubmitSiteConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sites: SiteIndexSite[];
  onSubmit?: () => void | Promise<void>;
}

const SubmitSiteConfirmation: FC<SubmitSiteConfirmationProps> = ({ open, onOpenChange, sites, onSubmit }) => {
  const t = useT();
  const [isSaving, setIsSaving] = useState(false);
  const items = useMemo(() => sites.map(({ id, name }) => ({ id, label: name })), [sites]);

  const handleSubmit = useCallback(async () => {
    try {
      setIsSaving(true);
      await onSubmit?.();
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }, [onSubmit, onOpenChange]);

  return (
    <ModalSubmit
      open={open}
      onOpenChange={onOpenChange}
      items={items}
      singular={{
        title: t("Submit site?"),
        description: t("Are you sure you want to submit")
      }}
      plural={{
        title: t("Submit sites?"),
        description: t("Are you sure you want to submit the following Sites:")
      }}
      isLoading={isSaving}
      confirmLabel={t("Submit")}
      onConfirm={handleSubmit}
    />
  );
};

export default SubmitSiteConfirmation;
