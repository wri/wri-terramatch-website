import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
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
    onOpenChange: fn(),
    onConfirm: fn(),
    items: [{ id: "polygon1", label: "Polygon Name 1" }],
    singular: { title: "Delete polygon?", description: "will be permanently removed from this site." },
    plural: {
      title: "Delete polygons?",
      description: "The following polygons will be permanently removed from this site."
    }
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
      { id: "polygon1", label: "Polygon Name 1" },
      { id: "polygon2", label: "Polygon Name 2" }
    ]
  }
};
