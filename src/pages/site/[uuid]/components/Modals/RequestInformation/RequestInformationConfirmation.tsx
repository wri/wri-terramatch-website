import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useState } from "react";

import { useMyUser } from "@/connections/User";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import CommentInput from "@/redesignComponents/content/Message/CommentInput";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import { formatCommentAuthorName } from "../../../utils/polygonStatusChangeComment";
import type { PolygonTableRow } from "../../PolygonTableRow";
import PolygonApprovalTable from "../ApprovePolygon/PolygonApprovalTable";

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

  const currentUserName = formatCommentAuthorName(user?.firstName, user?.lastName);
  const isCommentMissing = comment.trim() === "";

  useEffect(() => {
    if (!open) {
      setComment("");
    }
  }, [open]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleConfirm = useCallback(async () => {
    if (onRequestInformation == null || isCommentMissing) {
      return;
    }
    try {
      setIsSaving(true);
      await onRequestInformation(comment.trim());
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }, [comment, isCommentMissing, onRequestInformation, onOpenChange]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="large"
      header={<b className="text-theme-neutral-800">{t("Request information?")}</b>}
      content={
        <Flex className="-m-2.5 flex-col gap-4">
          <Box px={4} pt={4}>
            <Text textStyle="400" color="neutral.900" mb={4}>
              {t(
                `Are you sure you want to request additional information for the following ${
                  polygons.length === 1 ? "polygon" : "polygons"
                }?`
              )}
            </Text>
            <Box maxW="100%">
              <PolygonApprovalTable polygons={polygons} selectable={false} showArea={false} />
            </Box>
          </Box>
          <Box bg="warning.100" mb={-0.5}>
            <SimpleDivider backgroundColor="warning.300" />
            <Box px={4} pt={2} pb={4}>
              <Flex alignItems="center" gap={0.5}>
                <Text textStyle="400-bold" color="primary.900">
                  {t("Comment")}
                </Text>
                <Text as="span" textStyle="400-bold" color="error.500">
                  *
                </Text>
              </Flex>
              <Text textStyle="400" color="neutral.900" mb={2}>
                {t("Add a comment about the information required.")}
              </Text>
              <CommentInput
                name={currentUserName}
                placeholder={t("Describe what needs to be updated or clarified...")}
                value={comment}
                onValueChange={setComment}
                showSendIcon={false}
                showAttachFileIcon={false}
              />
            </Box>
          </Box>
        </Flex>
      }
      footer={
        <ButtonGroup
          borderColor="warning.300"
          buttons={[
            {
              id: "cancel",
              variant: "secondary",
              children: t("Cancel"),
              onClick: handleClose
            },
            {
              id: "confirm",
              children: t("Request Information"),
              disabled: isSaving || isCommentMissing,
              onClick: () => void handleConfirm()
            }
          ]}
        />
      }
    />
  );
};

export default RequestInformationConfirmation;
