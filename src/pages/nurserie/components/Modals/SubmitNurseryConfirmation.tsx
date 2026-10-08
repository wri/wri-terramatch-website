import { useT } from "@transifex/react";
import { FC, useCallback, useMemo, useState } from "react";

import ModalSubmit from "@/redesignComponents/containers/Modal/ModalSubmit";

import type { NurseryIndexRow } from "../../nurseryIndex.types";

export interface SubmitNurseryConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nurseries: NurseryIndexRow[];
  onSubmit?: () => void | Promise<void>;
}

const SubmitNurseryConfirmation: FC<SubmitNurseryConfirmationProps> = ({ open, onOpenChange, nurseries, onSubmit }) => {
  const t = useT();
  const [isSaving, setIsSaving] = useState(false);
  const items = useMemo(() => nurseries.map(({ id, name }) => ({ id, label: name ?? t("Nursery") })), [nurseries, t]);

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
        title: t("Submit nursery?"),
        description: t("Are you sure you want to submit")
      }}
      plural={{
        title: t("Submit nurseries?"),
        description: t("Are you sure you want to submit the following Nurseries:")
      }}
      isLoading={isSaving}
      confirmLabel={t("Submit")}
      onConfirm={handleSubmit}
    />
  );
};

export default SubmitNurseryConfirmation;
