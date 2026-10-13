import type { Meta, StoryObj } from "@storybook/react";
import { useT } from "@transifex/react";
import { useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";

import ModalSubmit from "./ModalSubmit";

const meta = {
  title: "Redesign Components/Containers/ModalSubmit",
  component: ModalSubmit,
  tags: ["autodocs"],
  args: {
    open: false,
    items: [{ id: "site1", label: "Site Name 1" }],
    singular: { title: "Submit site?", description: "Are you sure you want to submit" },
    plural: { title: "Submit sites?", description: "Are you sure you want to submit these sites?" }
  },
  render: args => {
    const t = useT();
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>{t("Show Modal")}</Button>
        <ModalSubmit {...args} open={open} onOpenChange={setOpen} onConfirm={() => setOpen(false)} />
      </>
    );
  }
} satisfies Meta<typeof ModalSubmit>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Singular: Story = {};

export const Plural: Story = {
  args: {
    items: [
      { id: "site1", label: "Site Name 1?" },
      { id: "site2", label: "Site Name 2?" }
    ]
  }
};
