import { Flex } from "@chakra-ui/react";
import React, { FC, useState } from "react";

import CommentCard from "@/redesignComponents/content/Message/CommentCard";
import CommentInput from "@/redesignComponents/content/Message/CommentInput";

const CURRENT_USER_INITIAL_MESSAGE =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget odio sapien. Integer euismod sagittis erat.";

const CURRENT_USER_ATTACHMENTS = [{ name: "attachment-1", url: "https://picsum.photos/seed/comment-card/340/280" }];

const PolygonCommentContent: FC = () => {
  const [isEditingCurrentUserComment, setIsEditingCurrentUserComment] = useState(false);
  const [savedCurrentUserMessage, setSavedCurrentUserMessage] = useState(CURRENT_USER_INITIAL_MESSAGE);
  const [draftCurrentUserMessage, setDraftCurrentUserMessage] = useState(CURRENT_USER_INITIAL_MESSAGE);

  return (
    <Flex className="min-h-0 flex-1 flex-col gap-2">
      <Flex className="mr-[0.25rem] min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden">
        <CommentCard
          className="pt-5 pr-7 pb-4 pl-6"
          participantType="other-user"
          state="view"
          authorName="Name Surname"
          createdAt="11/02/2026"
          message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget odio sapien. Integer euismod sagittis erat."
          attachments={[{ name: "attachment-1", url: "https://picsum.photos/seed/comment-card/340/280" }]}
          showUnreadIcon={true}
        />
        <CommentCard
          className="py-5 px-2 pl-6 pr-7"
          participantType="current-user"
          state={isEditingCurrentUserComment ? "edit" : "view"}
          authorName="Name Surname"
          createdAt="11/02/2026"
          message={savedCurrentUserMessage}
          value={draftCurrentUserMessage}
          attachments={CURRENT_USER_ATTACHMENTS}
          onEdit={() => {
            setDraftCurrentUserMessage(savedCurrentUserMessage);
            setIsEditingCurrentUserComment(true);
          }}
          onValueChange={setDraftCurrentUserMessage}
          onCancelEditing={() => {
            setDraftCurrentUserMessage(savedCurrentUserMessage);
            setIsEditingCurrentUserComment(false);
          }}
          onSaveEditing={() => {
            setSavedCurrentUserMessage(draftCurrentUserMessage);
            setIsEditingCurrentUserComment(false);
          }}
        />
        <CommentCard
          className="py-5 px-2 pl-6 pr-7"
          participantType="other-user"
          state="view"
          authorName="Name Surname"
          createdAt="11/02/2026"
          message="Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget odio sapien. Integer euismod sagittis erat."
          attachments={[{ name: "attachment-1", url: "https://picsum.photos/seed/comment-card/340/280" }]}
          showUnreadIcon={true}
        />
      </Flex>
      <Flex className="py-5 pl-4 pr-7">
        <CommentInput name="Name Surname" placeholder="Write a message..." />
      </Flex>
    </Flex>
  );
};

export default PolygonCommentContent;
