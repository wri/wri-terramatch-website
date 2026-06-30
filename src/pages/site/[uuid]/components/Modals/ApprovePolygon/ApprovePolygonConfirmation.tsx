import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useState } from "react";

import { useMyUser } from "@/connections/User";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import CommentInput from "@/redesignComponents/content/Message/CommentInput";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import type { PolygonTableRow } from "../../PolygonTableRow";
import PolygonApprovalTable from "./PolygonApprovalTable";

const formatAuthorName = (firstName?: string | null, lastName?: string | null): string =>
  firstName == null && lastName == null ? "Unknown User" : `${firstName ?? ""} ${lastName ?? ""}`.trim();

export interface ApprovePolygonConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: PolygonTableRow[];
  onApprove?: (comment: string) => void | Promise<void>;
  onRequestInformation?: () => void | Promise<void>;
}

const ApprovePolygonConfirmation: FC<ApprovePolygonConfirmationProps> = ({
  open,
  onOpenChange,
  polygons,
  onApprove
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

  const handleApprove = useCallback(async () => {
    if (onApprove == null) {
      onOpenChange(false);
      return;
    }

    try {
      setIsSaving(true);
      await onApprove(comment.trim());
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }, [comment, onApprove, onOpenChange]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="large"
      header={
        <b className="text-theme-neutral-800">
          {polygons.length === 1 ? t("Approve polygon?") : t("Approve polygons?")}
        </b>
      }
      content={
        <Flex className="-m-2.5 flex-col gap-4">
          <Box px={4} pt={4}>
            <Text textStyle="400" color="neutral.900" display={"flex"} gap={0.5} alignItems={"center"} mb={4}>
              {t(`You’re about to approve the following ${polygons.length === 1 ? "polygon" : "polygons"}:`)}
            </Text>
            <Box maxW="100%">
              <PolygonApprovalTable polygons={polygons} />
            </Box>
            <SimpleDivider className="mb-4 mt-0.5" />
            <Text textStyle="400-bold" color="primary.900">
              {t("Approved project area")}
            </Text>
            <Flex flexDirection={"column"} gap={1} mt={2}>
              <Flex alignItems={"center"} gap={2}>
                <Text textStyle="300" color="neutral.700" lineHeight={"normal"}>
                  {t("Current total:")}
                </Text>
                <Text textStyle="400" color="primary.900">
                  <b>XXX</b>
                  {" ha ("}
                  <b>XXX</b>
                  {"%)"}
                </Text>
              </Flex>
              <Flex alignItems={"center"} gap={2}>
                <Text textStyle="300" color="neutral.700" lineHeight={"normal"}>
                  {t("After approval:")}
                </Text>
                <Text textStyle="400" color="primary.900">
                  <b>XXX</b>
                  {" ha ("}
                  <b>XXX</b>
                  {"%)"}
                </Text>
              </Flex>
            </Flex>
          </Box>
          <Box bg="neutral.200" mb={-0.5}>
            <SimpleDivider />
            <CommentInput
              label={t("Comment")}
              showOptionalLabel={true}
              caption={t("Add a comment about this approval.")}
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
              id: "save",
              children: t("Yes, submit"),
              disabled: isSaving,
              onClick: () => void handleApprove()
            }
          ]}
        />
      }
    />
  );
};

export default ApprovePolygonConfirmation;
