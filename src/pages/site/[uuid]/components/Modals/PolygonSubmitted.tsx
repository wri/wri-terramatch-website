import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import CommentCard from "@/redesignComponents/content/Message/CommentCard";
import { CheckApprovedIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import type { SubmittedPolygonComment } from "../../hooks/useSitePolygonBulkActions";

export interface PolygonSubmittedProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: string[];
  submittedComment?: SubmittedPolygonComment | null;
}

const PolygonSubmitted: FC<PolygonSubmittedProps> = ({ open, onOpenChange, polygons, submittedComment }) => {
  const t = useT();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const isSinglePolygon = polygons.length === 1;
  const hasSubmittedComment = submittedComment != null && submittedComment.message.trim() !== "";

  const commentContent = hasSubmittedComment ? (
    <>
      <SimpleDivider className="my-2 -ml-3 !w-[calc(100%_+_1.25rem)]" />
      <Text textStyle="400-bold" color="primary.900">
        {t("Comment")}
      </Text>
      <Flex>
        <CommentCard
          participantType="current-user"
          authorName={submittedComment.authorName}
          createdAt={submittedComment.createdAt}
          message={submittedComment.message}
          showUnreadIcon={false}
          showContextOptions={false}
        />
      </Flex>
    </>
  ) : null;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      header={
        <b className="text-theme-neutral-800">{isSinglePolygon ? t("Polygon submitted") : t("Polygons submitted")}</b>
      }
      content={
        <>
          {isSinglePolygon ? (
            <Flex justifyContent="center" alignItems="center" flexDirection="column" pt={2} px={4}>
              <CheckApprovedIcon boxSize={8} color={"success.500"} mb={2} />
              <Text textStyle="500-bold" color="neutral.900" textAlign="center">
                {polygons[0]}
              </Text>
              <Text textStyle="400" color="neutral.900">
                {t("has been submitted.")}
              </Text>
            </Flex>
          ) : (
            <Box px={4}>
              <Text textStyle="400" color="neutral.900" display={"flex"} gap={0.5} mb={3} alignItems={"center"}>
                <CheckApprovedIcon boxSize={4} color={"success.500"} mr={2} />
                {t("The following Polygons")}
                <Text textStyle="400-bold" color="neutral.900" ml={0.5}>
                  {t("have been submitted:")}
                </Text>
              </Text>
              <Flex flexDirection="column" gap={4} bg={"neutral.200"} py={2} px={3} rounded={4}>
                <List.Root as="ul" pl={4} spaceY={2} listStyleType="disc">
                  {polygons.map((item, index) => (
                    <List.Item
                      key={`${item}-${index}`}
                      _marker={{
                        color: "neutral.900"
                      }}
                    >
                      <Text textStyle="400" color="neutral.900">
                        {item}
                      </Text>
                    </List.Item>
                  ))}
                </List.Root>
              </Flex>
            </Box>
          )}
          {commentContent}
        </>
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "close",
              className: "!w-fit",
              variant: "secondary",
              children: t("Close"),
              autoFocus: true,
              onClick: handleClose
            }
          ]}
        />
      }
    />
  );
};

export default PolygonSubmitted;
