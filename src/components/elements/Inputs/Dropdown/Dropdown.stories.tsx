import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { OptionValue } from "@/types/common";

import Component, { DropdownProps as Props } from "./Dropdown";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/Dropdown",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const SingleSelect: Story = {
  render: (args: Props) => {
    const [value, setValue] = useState<OptionValue[]>([]);

    return (
      <div className="relative">
        <Component
          {...args}
          value={value}
          onChange={v => {
            console.log(v);
            setValue(v);
          }}
        />
      </div>
    );
  },
  args: {
    label: "Drop down label",
    description: "Drop down description",
    placeholder: "placeholder",
    options: [
      {
        title: "Option 1",
        value: 1
      },
      {
        title: "Option 2",
        value: 2
      },
      {
        title: "Option 3",
        value: 3
      },
      {
        title: "Option 4",
        value: 4
      },
      {
        title: "Option 5",
        value: 5
      },
      {
        title: "Option 6",
        value: 6
      },
      {
        title: "Option 7",
        value: 7
      },
      {
        title: "Option 8",
        value: 8
      },
      {
        title: "Option 9",
        value: 9
      }
    ]
  }
};

export const MultiSelect: Story = {
  ...SingleSelect,
  args: {
    ...SingleSelect.args,
    multiSelect: true
  }
};

export const SingleSelectWithOtherOption: Story = {
  ...SingleSelect,
  args: {
    ...SingleSelect.args,
    hasOtherOptions: true
  }
};

export const MultiSelectWithOtherOption: Story = {
  ...SingleSelect,
  args: {
    ...SingleSelect.args,
    multiSelect: true,
    hasOtherOptions: true
  }
};
