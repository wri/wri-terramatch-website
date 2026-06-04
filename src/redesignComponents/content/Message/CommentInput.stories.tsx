import type { Meta, StoryObj } from "@storybook/react";
import { type ComponentProps, useState } from "react";

import CommentInput from "./CommentInput";

const meta = {
  title: "Redesign Components/Content/Message/CommentInput",
  component: CommentInput,
  parameters: {
    layout: "padded"
  },
  tags: ["autodocs"],
  argTypes: {
    name: {
      control: "text",
      description: "User name for the avatar"
    },
    placeholder: {
      control: "text",
      description: "Placeholder text for the comment field"
    },
    isEditing: {
      table: { disable: true }
    }
  }
} satisfies Meta<typeof CommentInput>;

export default meta;
type Story = StoryObj<typeof meta>;

type CommentInputStoryProps = ComponentProps<typeof CommentInput> & {
  initialIsEditing?: boolean;
};

const CommentInputWithState = ({ initialIsEditing = false, ...args }: CommentInputStoryProps) => {
  const [isEditing, setIsEditing] = useState(initialIsEditing);
  const [value, setValue] = useState("");

  return (
    <div style={{ maxWidth: "40rem", width: "100%" }}>
      <CommentInput
        {...args}
        value={value}
        onChange={event => setValue(event.target.value)}
        isEditing={isEditing}
        onCancelEditing={() => setIsEditing(false)}
        onSaveEditing={() => setIsEditing(false)}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    name: "John Doe",
    placeholder: "Write a message..."
  },
  render: args => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState("");

    return (
      <div style={{ maxWidth: "40rem", width: "100%" }}>
        <CommentInput
          {...args}
          value={value}
          onChange={event => setValue(event.target.value)}
          isEditing={isEditing}
          onEditingChange={setIsEditing}
          onCancelEditing={() => setIsEditing(false)}
          onSaveEditing={() => setIsEditing(false)}
        />
        {!isEditing && (
          <button type="button" style={{ marginTop: "0.5rem" }} onClick={() => setIsEditing(true)}>
            Start editing
          </button>
        )}
      </div>
    );
  }
};

export const Editing: Story = {
  args: {
    name: "John Doe",
    placeholder: "Write a message...",
    files: [{ name: "file1.pdf", url: "https://picsum.photos/seed/comment-file/340/280", onRemoveFile: () => {} }]
  },
  render: args => <CommentInputWithState {...args} initialIsEditing />
};

export const WithFiles: Story = {
  args: {
    name: "John Doe",
    placeholder: "Write a message...",
    files: [{ name: "file1.pdf", url: "https://picsum.photos/seed/comment-file/340/280", onRemoveFile: () => {} }]
  },
  render: args => <CommentInputWithState {...args} initialIsEditing={false} />
};
