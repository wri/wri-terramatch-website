import type { Meta, StoryObj } from "@storybook/react";

import Checkbox from "@/redesignComponents/Forms/Actions/Checkbox/Checkbox";
import CheckboxList from "@/redesignComponents/Forms/Inputs/CheckboxList";
import DatePickerInput from "@/redesignComponents/Forms/Inputs/DateInputs/DatePickerInput/DatePickerInput";
import DateRangeInput from "@/redesignComponents/Forms/Inputs/DateInputs/DateRangeInputs/DateRangeInput";
import SelectInput from "@/redesignComponents/Forms/Inputs/SelectInput";
import TextInput from "@/redesignComponents/Forms/Inputs/TextInput";

import FilterCards from "./FilteCards";

const meta = {
  title: "Redesign Components/Containers/Panel/Filter Cards",
  component: FilterCards,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  args: {
    label: "Label",
    caption: "Caption",
    className: "!w-[20.875rem]"
  }
} satisfies Meta<typeof FilterCards>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: <TextInput />
  }
};

export const WithTextInput: Story = {
  args: {
    children: <TextInput />
  }
};

export const WithSelectInput: Story = {
  args: {
    children: (
      <SelectInput
        items={[
          {
            label: "Option 1",
            value: "option-1"
          },
          {
            label: "Option 2",
            value: "option-2"
          },
          {
            label: "Option 3",
            value: "option-3"
          }
        ]}
        onChange={() => {}}
        placeholder="Please select"
      />
    )
  }
};

export const WithDatePickerInput: Story = {
  args: {
    children: <DatePickerInput />
  }
};

export const WithDateRangeInput: Story = {
  args: {
    children: <DateRangeInput />
  }
};

export const WithCheckboxList: Story = {
  args: {
    children: (
      <>
        <Checkbox name="Checkbox" value="1" defaultChecked>
          Label
        </Checkbox>
        <CheckboxList
          label={{ type: "checkbox", label: "Label", name: "all" }}
          checkboxes={[
            {
              children: "Label",
              name: "checkbox-1",
              value: "checkbox-1"
            },
            {
              children: "Label",
              name: "checkbox-2",
              value: "checkbox-2"
            },
            {
              children: "Label",
              name: "checkbox-3",
              value: "checkbox-3"
            }
          ]}
        />

        <CheckboxList
          label={{ type: "checkbox", label: "Label", name: "all" }}
          checkboxes={[
            {
              children: "Label",
              name: "checkbox-1",
              value: "checkbox-1"
            },
            {
              children: "Label",
              name: "checkbox-2",
              value: "checkbox-2"
            },
            {
              children: "Label",
              name: "checkbox-3",
              value: "checkbox-3"
            },
            {
              children: "Label",
              name: "checkbox-4",
              value: "checkbox-4"
            },
            {
              children: "Label",
              name: "checkbox-5",
              value: "checkbox-5"
            }
          ]}
        />
        <Checkbox name="Checkbox2" value="1" defaultChecked>
          Label
        </Checkbox>
        <Checkbox name="Checkbox3" value="1" defaultChecked>
          Label
        </Checkbox>
      </>
    )
  }
};
