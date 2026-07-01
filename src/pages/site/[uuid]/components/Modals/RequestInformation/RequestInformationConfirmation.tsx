import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useState } from "react";

import { useMyUser } from "@/connections/User";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import CommentInput from "@/redesignComponents/content/Message/CommentInput";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import type { PolygonTableRow } from "../../PolygonTableRow";
import PolygonApprovalTable from "../ApprovePolygon/PolygonApprovalTable";

const formatAuthorName = (firstName?: string | null, lastName?: string | null): string =>
  firstName == null && lastName == null ? "Unknown User" : `${firstName ?? ""} ${lastName ?? ""}`.trim();

export interface RequestInformationConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: PolygonTableRow[];
  onRequestInformation?: (comment: string) => void | Promise<void>;
}

const RequestInformationConfirmation: FC<RequestInformationConfirmationProps> = ({
  open,
  onOpenChange,
  polygons,
  onRequestInformation
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

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleConfirm = useCallback(async () => {
    if (onRequestInformation == null) {
      onOpenChange(false);
      return;
    }
    try {
      setIsSaving(true);
      await onRequestInformation(comment.trim());
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }, [comment, onRequestInformation, onOpenChange]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="large"
      header={
        <b className="text-theme-neutral-800">
          {polygons.length === 1 ? t("Request information for polygon?") : t("Request information for polygons?")}
        </b>
      }
      content={
        <Flex className="-m-2.5 flex-col gap-4">
          <Box px={4} pt={4}>
            <Text textStyle="400" color="neutral.900" mb={4}>
              {t(
                `You're about to request information for the following ${
                  polygons.length === 1 ? "polygon" : "polygons"
                }:`
              )}
            </Text>
            <Box maxW="100%">
              <PolygonApprovalTable polygons={polygons} />
            </Box>
          </Box>
          <Box bg="neutral.200" mb={-0.5}>
            <SimpleDivider />
            <CommentInput
              label={t("Comment")}
              showOptionalLabel={true}
              caption={t("Describe what additional information is needed.")}
              name={currentUserName}
              placeholder={t("Write a message...")}
              value={comment}
              onValueChange={setComment}
              showSendIcon={false}
              showAttachFileIcon={false}
              className="px-4 pt-2 pb-4"
            />
          </Box>
        </Flex>
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "cancel",
              variant: "secondary",
              children: t("Cancel"),
              onClick: handleClose
            },
            {
              id: "confirm",
              children: t("Request information"),
              disabled: isSaving,
              onClick: () => void handleConfirm()
            }
          ]}
        />
      }
    />
  );
};

export default RequestInformationConfirmation;
