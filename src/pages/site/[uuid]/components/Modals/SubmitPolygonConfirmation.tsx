import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useState } from "react";

import { useMyUser } from "@/connections/User";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
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
  trapFocus?: boolean;
  restoreFocus?: boolean;
}

const SubmitPolygonConfirmation: FC<SubmitPolygonConfirmationProps> = ({
  open,
  onOpenChange,
  polygons,
  onSubmit,
  modal = true,
  trapFocus = true,
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

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

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

  return (
    <Modal
      modal={modal}
      trapFocus={trapFocus}
      restoreFocus={restoreFocus}
      open={open}
      onClose={handleClose}
      size="medium"
      contentPadding={false}
      header={
        <b className="text-theme-neutral-800">{polygons.length === 1 ? t("Submit Polygon?") : t("Submit Polygons?")}</b>
      }
      content={
        <Flex className="flex-col gap-4">
          {polygons.length === 1 ? (
            <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={4}>
              <Text textStyle="400" color="neutral.900">
                {t("Are you sure you want to submit")}
              </Text>
              <Text textStyle="500-bold" color="neutral.900" textAlign="center">
                {polygons[0].polygonName}?
              </Text>
            </Flex>
          ) : (
            <Box px={4}>
              <Text textStyle="400" color="neutral.900" display={"flex"} gap={0.5} alignItems={"center"}>
                {t("Are you sure you want to submit these polygons?")}
              </Text>
              <Flex flexDirection="column" gap={4} bg={"neutral.200"} py={2} px={3} rounded={4}>
                <List.Root as="ul" pl={4} spaceY={2} listStyleType="disc">
                  {polygons.map(item => (
                    <List.Item
                      key={item.id}
                      _marker={{
                        color: "neutral.900"
                      }}
                    >
                      <Text textStyle="400" color="neutral.900" as={"span"}>
                        {item.polygonName}
                      </Text>
                    </List.Item>
                  ))}
                </List.Root>
              </Flex>
            </Box>
          )}
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
              onClick: () => void handleSave()
            }
          ]}
        />
      }
    />
  );
};

export default SubmitPolygonConfirmation;
