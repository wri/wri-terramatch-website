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
    items: [{ id: "north", label: "North plot" }],
    singular: { title: "Submit plot?", description: "Are you sure you want to submit" },
    plural: { title: "Submit plots?", description: "Are you sure you want to submit these plots?" }
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
      { id: "north", label: "North plot" },
      { id: "south", label: "South plot" }
    ]
  }
};

export const Loading: Story = {
  args: { isLoading: true }
};

export const EmptySelection: Story = {
  args: { items: [] }
};
