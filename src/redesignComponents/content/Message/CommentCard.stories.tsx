import { Box } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import CommentCard from "./CommentCard";

const defaultAttachments = [{ name: "attachment-1", url: "https://picsum.photos/seed/comment-card/340/280" }];

const meta = {
  title: "Redesign Components/Content/Message/CommentCard",
  component: CommentCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  decorators: [
    Story => (
      <Box backgroundColor="neutral.200" padding={6}>
        <Story />
      </Box>
    )
  ]
} satisfies Meta<typeof CommentCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OtherUserView: Story = {
  args: {
    participantType: "other-user",
    state: "view",
    authorName: "Name Surname",
    createdAt: "11/02/2026",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget odio sapien. Integer euismod sagittis erat.",
    attachments: defaultAttachments,
    showUnreadIcon: true
  }
};

export const CurrentUserView: Story = {
  args: {
    participantType: "current-user",
    authorName: "Name Surname",
    createdAt: "11/02/2026",
    message:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget odio sapien. Integer euismod sagittis erat.",
    attachments: defaultAttachments
  },
  render: args => {
    const initialMessage =
      args.message ??
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In eget odio sapien. Integer euismod sagittis erat.";
    const [isEditing, setIsEditing] = useState(false);
    const [savedMessage, setSavedMessage] = useState(initialMessage);
    const [draftMessage, setDraftMessage] = useState(initialMessage);

    return (
      <CommentCard
        {...args}
        state={isEditing ? "edit" : "view"}
        message={savedMessage}
        value={draftMessage}
        onEdit={() => {
          setDraftMessage(savedMessage);
          setIsEditing(true);
        }}
        onValueChange={setDraftMessage}
        onCancelEditing={() => {
          setDraftMessage(savedMessage);
          setIsEditing(false);
        }}
        onSaveEditing={() => {
          setSavedMessage(draftMessage);
          setIsEditing(false);
        }}
      />
    );
  }
};

export const EmptyState: Story = {
  args: {
    participantType: "empty",
    state: "view"
  }
};
