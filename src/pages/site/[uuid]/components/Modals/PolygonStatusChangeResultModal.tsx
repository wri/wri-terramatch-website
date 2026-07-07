import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, ReactNode, useCallback } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import CommentCard from "@/redesignComponents/content/Message/CommentCard";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import type { PolygonStatusChangeComment } from "../../utils/polygonStatusChangeComment";

export interface PolygonStatusChangeResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: string[];
  comment?: PolygonStatusChangeComment | null;
  singleTitle: string;
  pluralTitle: string;
  renderSingleContent: (polygonName: string) => ReactNode;
  renderPluralLeadContent: () => ReactNode;
}

const PolygonStatusChangeResultModal: FC<PolygonStatusChangeResultModalProps> = ({
  open,
  onOpenChange,
  polygons,
  comment,
  singleTitle,
  pluralTitle,
  renderSingleContent,
  renderPluralLeadContent
}) => {
  const t = useT();

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const isSinglePolygon = polygons.length === 1;
  const hasComment = comment != null && comment.message.trim() !== "";

  const commentContent = hasComment ? (
    <Box mb={-0.5}>
      <SimpleDivider className="my-2 -ml-3 !w-[calc(100%_+_1.25rem)]" />
      <Box>
        <Text textStyle="400-bold" color="primary.900" pl={2} pt={1}>
          {t("Comment")}
        </Text>
        <CommentCard
          participantType="current-user"
          authorName={comment.authorName}
          createdAt={comment.createdAt}
          message={comment.message}
          showUnreadIcon={false}
          showContextOptions={false}
          className="bg-theme-neutral-100 px-2 pt-2 pb-4"
        />
      </Box>
    </Box>
  ) : null;

  return (
    <Modal
      modal={false}
      open={open}
      onClose={handleClose}
      size="medium"
      header={<b className="text-theme-neutral-800">{isSinglePolygon ? singleTitle : pluralTitle}</b>}
      content={
        <>
          {isSinglePolygon ? (
            renderSingleContent(polygons[0])
          ) : (
            <Box px={4}>
              {renderPluralLeadContent()}
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

export default PolygonStatusChangeResultModal;
