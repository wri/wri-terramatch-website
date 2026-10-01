import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { useMyUser } from "@/connections/User";
import ModalSubmit from "@/redesignComponents/containers/Modal/ModalSubmit";
import CommentInput from "@/redesignComponents/content/Message/CommentInput";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import type { PolygonTableRow } from "../PolygonTableRow";

const formatAuthorName = (firstName?: string | null, lastName?: string | null): string =>
  firstName == null && lastName == null ? "Unknown User" : `${firstName ?? ""} ${lastName ?? ""}`.trim();

export interface SubmitPolygonConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: PolygonTableRow[];
  onSubmit?: (comment: string) => void | Promise<void>;
  modal?: boolean;
  restoreFocus?: boolean;
}

const SubmitPolygonConfirmation: FC<SubmitPolygonConfirmationProps> = ({
  open,
  onOpenChange,
  polygons,
  onSubmit,
  modal = true,
  restoreFocus = true
}) => {
  const t = useT();
  const [, { user }] = useMyUser();
  const [isSaving, setIsSaving] = useState(false);
  const [comment, setComment] = useState("");

  const currentUserName = formatAuthorName(user?.firstName, user?.lastName);

  useEffect(() => {
    if (!open) {
      setComment("");
    }
  }, [open]);

  const handleSave = useCallback(async () => {
    if (onSubmit == null) {
      onOpenChange(false);
      return;
    }

    try {
      setIsSaving(true);
      await onSubmit(comment.trim());
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }, [comment, onSubmit, onOpenChange]);

  const items = useMemo(() => polygons.map(({ id, polygonName }) => ({ id, label: polygonName })), [polygons]);

  return (
    <ModalSubmit
      modal={modal}
      restoreFocus={restoreFocus}
      open={open}
      onOpenChange={onOpenChange}
      items={items}
      singular={{ title: t("Submit Polygon?"), description: t("Are you sure you want to submit") }}
      plural={{ title: t("Submit Polygons?"), description: t("Are you sure you want to submit these polygons?") }}
      isLoading={isSaving}
      onConfirm={handleSave}
    >
      <Box bg="neutral.200" mb={-0.5}>
        <SimpleDivider />
        <CommentInput
          label={t("Comment")}
          showOptionalLabel={true}
          caption={t("Add a comment about this submission.")}
          name={currentUserName}
          placeholder={t("Write a message...")}
          value={comment}
          onValueChange={setComment}
          showSendIcon={false}
          showAttachFileIcon={false}
          className="px-4 pt-2 pb-4"
        />
      </Box>
    </ModalSubmit>
  );
};

export default SubmitPolygonConfirmation;
