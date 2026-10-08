import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";

import FilterCard from "./FilterPanelElements/FilterCards";
import IndexFilterDrawer from "./IndexFilterDrawer";

const IndexFilterDrawerDemo = () => {
  const [open, setOpen] = useState(false);
  const [draftStatuses, setDraftStatuses] = useState<string[]>(["draft"]);

  const tags = draftStatuses.map(status => ({
    id: `status-${status}`,
    label: status === "draft" ? "Draft" : status
  }));

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open filters</Button>
      <IndexFilterDrawer
        open={open}
        onOpenChange={setOpen}
        tags={tags}
        onRemoveTag={id => {
          if (id.startsWith("status-")) {
            const value = id.replace("status-", "");
            setDraftStatuses(current => current.filter(status => status !== value));
          }
        }}
        onClear={() => setDraftStatuses([])}
        onApply={() => undefined}
        drawerMaxW="22rem"
      >
        <FilterCard label="Status">
          {(["draft", "approved"] as const).map(value => (
            <Checkbox
              key={value}
              name={`demo-status-${value}`}
              value={value}
              checked={draftStatuses.includes(value)}
              onCheckedChange={({ checked }) => {
                setDraftStatuses(current =>
                  checked === true
                    ? current.includes(value)
                      ? current
                      : [...current, value]
                    : current.filter(status => status !== value)
                );
              }}
            >
              {value}
            </Checkbox>
          ))}
        </FilterCard>
      </IndexFilterDrawer>
    </>
  );
};

const meta = {
  title: "Redesign Components/Containers/Panel/Index Filter Drawer",
  component: IndexFilterDrawerDemo,
  tags: ["autodocs"]
} satisfies Meta<typeof IndexFilterDrawerDemo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
