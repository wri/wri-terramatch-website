import type { Meta, StoryObj } from "@storybook/react";
import { useT } from "@transifex/react";
import { useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";

import ModalDelete from "./ModalDelete";

const meta = {
  title: "Redesign Components/Containers/ModalDelete",
  component: ModalDelete,
  tags: ["autodocs"],
  args: {
    open: false,
    items: [{ id: "north", label: "North plot" }],
    singular: { title: "Delete plot?", description: "will be permanently removed from this site." },
    plural: { title: "Delete plots?", description: "The following plots will be permanently removed from this site." }
  },
  render: args => {
    const t = useT();
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>{t("Show Modal")}</Button>
        <ModalDelete {...args} open={open} onOpenChange={setOpen} onConfirm={() => setOpen(false)} />
      </>
    );
  }
} satisfies Meta<typeof ModalDelete>;

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
