import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useMemo, useState } from "react";

import { pruneEntityCache, useFullProject } from "@/connections/Entity";
import { useMyUser } from "@/connections/User";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import CommentInput from "@/redesignComponents/content/Message/CommentInput";
import { useTableSelection } from "@/redesignComponents/dataDisplay/Table/useTableSelection";
import { WarningIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import InlineMessage from "@/redesignComponents/status/InlineMessage/InlineMessage";
import { formatNumberLocaleString } from "@/utils/dashboardUtils";

import type { PolygonTableRow } from "../../PolygonTableRow";
import { calculateApprovedProjectAreaStats } from "./approvePolygonAreaStats";
import PolygonApprovalTable from "./PolygonApprovalTable";

const formatAuthorName = (firstName?: string | null, lastName?: string | null): string =>
  firstName == null && lastName == null ? "Unknown User" : `${firstName ?? ""} ${lastName ?? ""}`.trim();

export interface ApprovePolygonConfirmationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: PolygonTableRow[];
  projectUuid?: string | null;
  onApprove?: (comment: string, selectedPolygons: PolygonTableRow[]) => void | Promise<void>;
}

const ApprovePolygonConfirmation: FC<ApprovePolygonConfirmationProps> = ({
  open,
  onOpenChange,
  polygons,
  projectUuid,
  onApprove
}) => {
  const t = useT();
  const [, { user }] = useMyUser();
  const [isSaving, setIsSaving] = useState(false);
  const [comment, setComment] = useState("");

  const { selectedRows, handleRowSelected, onAllItemsSelected, setSelectedRowIds } = useTableSelection(true, polygons);

  const [isProjectLoaded, { data: project }] = useFullProject({
    id: projectUuid ?? ""
  });

  useEffect(() => {
    if (projectUuid != null && projectUuid !== "") {
      pruneEntityCache("projects", projectUuid);
    }
  }, [projectUuid, open]);

  useEffect(() => {
    if (!open) {
      setComment("");
      return;
    }
    setSelectedRowIds(new Set(polygons.map(polygon => polygon.id)));
  }, [open, polygons, setSelectedRowIds]);

  const currentUserName = formatAuthorName(user?.firstName, user?.lastName);

  const areaStats = useMemo(() => {
    if (projectUuid == null || projectUuid === "" || !isProjectLoaded || project == null) {
      return null;
    }

    return calculateApprovedProjectAreaStats(
      project.totalHectaresRestoredGoal,
      project.totalHectaresRestoredSum,
      selectedRows
    );
  }, [isProjectLoaded, project, projectUuid, selectedRows]);

  const isSinglePolygon = polygons.length === 1;

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleApprove = useCallback(async () => {
    if (onApprove == null || selectedRows.length === 0) {
      onOpenChange(false);
      return;
    }

    try {
      setIsSaving(true);
      await onApprove(comment.trim(), selectedRows);
      onOpenChange(false);
    } finally {
      setIsSaving(false);
    }
  }, [comment, onApprove, onOpenChange, selectedRows]);

  return (
    <Modal
      modal={false}
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
            {areaStats?.exceedsApprovedAreaLimit === true && (
              <InlineMessage
                className="mb-4"
                variant="warning"
                size="full-width"
                icon={<WarningIcon />}
                label={t("Warning")}
                caption={t(
                  isSinglePolygon
                    ? "Approving this polygon will exceed the 125% approved area limit."
                    : "Approving these polygons will exceed the 125% approved area limit."
                )}
              />
            )}
            <Text textStyle="400" color="neutral.900" display={"flex"} gap={0.5} alignItems={"center"} mb={4}>
              {t(`You're about to approve the following ${polygons.length === 1 ? "polygon" : "polygons"}:`)}
            </Text>
            <Box maxW="100%">
              <PolygonApprovalTable
                polygons={polygons}
                selectedRows={selectedRows}
                onRowSelected={handleRowSelected}
                onAllItemsSelected={onAllItemsSelected}
              />
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
                  {areaStats != null ? (
                    <>
                      <b>{formatNumberLocaleString(areaStats.currentArea)}</b>
                      {" ha ("}
                      <b>{formatNumberLocaleString(areaStats.currentPercentage)}</b>
                      {"%)"}
                    </>
                  ) : (
                    "—"
                  )}
                </Text>
              </Flex>
              <Flex alignItems={"center"} gap={2}>
                <Text textStyle="300" color="neutral.700" lineHeight={"normal"}>
                  {t("After approval:")}
                </Text>
                <Text textStyle="400" color="primary.900">
                  {areaStats != null ? (
                    <>
                      <b>{formatNumberLocaleString(areaStats.afterApprovalArea)}</b>
                      {" ha ("}
                      <b>{formatNumberLocaleString(areaStats.afterApprovalPercentage)}</b>
                      {"%)"}
                    </>
                  ) : (
                    "—"
                  )}
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
              children: t("Approve"),
              disabled: isSaving || selectedRows.length === 0,
              onClick: () => void handleApprove()
            }
          ]}
        />
      }
    />
  );
};

export default ApprovePolygonConfirmation;
