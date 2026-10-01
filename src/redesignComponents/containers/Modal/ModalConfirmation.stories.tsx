import { Text } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { useT } from "@transifex/react";
import { useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";

import ModalConfirmation from "./ModalConfirmation";

const meta = {
  title: "Redesign Components/Containers/ModalConfirmation",
  component: ModalConfirmation,
  tags: ["autodocs"],
  args: { open: false },
  render: args => {
    const t = useT();
    const [open, setOpen] = useState(false);

    return (
      <>
        <Button onClick={() => setOpen(true)}>{t("Show Modal")}</Button>
        <ModalConfirmation
          {...args}
          open={open}
          onOpenChange={setOpen}
          title={t(args.title)}
          confirmButton={
            args.confirmButton == null ? undefined : { ...args.confirmButton, onClick: () => setOpen(false) }
          }
        />
      </>
    );
  }
} satisfies Meta<typeof ModalConfirmation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirmation: Story = {
  args: {
    title: "Save Changes?",
    content: "Are you sure you want to save these changes?",
    confirmButton: { id: "confirm", children: "Save" }
  }
};

export const Delete: Story = {
  args: {
    title: "Delete polygon?",
    content: "This action cannot be undone.",
    confirmButton: { id: "delete", variant: "negative", children: "Delete" }
  }
};

export const Deleting: Story = {
  args: {
    ...Delete.args,
    confirmButton: { id: "delete", variant: "negative", children: "Deleting...", loading: true, disabled: true },
    cancelButton: { disabled: true }
  }
};

export const CustomContent: Story = {
  args: {
    ...Confirmation.args,
    contentLayout: "custom",
    content: (
      <Text textStyle="500-bold" color="neutral.900">
        Example polygon
      </Text>
    )
  }
};

export const GroupedActions: Story = {
  args: {
    title: "Save Changes?",
    content: "Choose an action.",
    buttonsCancel: [{ id: "cancel", variant: "secondary", children: "Cancel" }],
    buttonsSecondary: [{ id: "download", variant: "secondary", children: "Download" }],
    buttonsPrimary: [{ id: "save", children: "Save" }]
  }
};
