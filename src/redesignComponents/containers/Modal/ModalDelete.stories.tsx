import { Flex, Text } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { useT } from "@transifex/react";
import { useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";

import ModalDelete from "./ModalDelete";
import { LABEL_COLUMN_KEY } from "./ModalSelection";

const meta = {
  title: "Redesign Components/Containers/ModalDelete",
  component: ModalDelete,
  tags: ["autodocs"],
  args: {
    open: false,
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

const TABLE_ITEMS = Array.from({ length: 10 }, (_, index) => ({
  id: `polygon${index + 1}`,
  label: `Polygon Name ${index + 1}`,
  cells: { siteName: `Site Name ${(index % 3) + 1}`, projectName: "Greening the Rift Valley" }
}));

const BACKGROUND_NOTE = (
  <Text textStyle="400" color="neutral.900">
    This runs in the background, you can leave this page.
  </Text>
);

export const TableView: Story = {
  args: {
    view: "table",
    columns: [
      { key: LABEL_COLUMN_KEY, label: "Polygon Name" },
      { key: "siteName", label: "Site" },
      { key: "projectName", label: "Project" }
    ],
    items: TABLE_ITEMS,
    plural: { title: "Delete polygons?", description: "The following polygons will be permanently removed." },
    footnote: <Flex className="mt-3 flex-col gap-3">{BACKGROUND_NOTE}</Flex>
  }
};

export const TableViewCollapsed: Story = {
  args: {
    ...TableView.args,
    items: TABLE_ITEMS.slice(0, 3),
    footnote: (
      <Flex className="mt-3 flex-col gap-3">
        <Text textStyle="300" color="neutral.800">
          and 42 more polygons
        </Text>
        {BACKGROUND_NOTE}
      </Flex>
    )
  }
};
