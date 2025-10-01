import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import { FieldDefinition } from "@/components/extensive/WizardForm/types";

import Component, { SimpleFormProps as Props } from "./SimpleForm";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Form/Simple",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const client = new QueryClient();
const fields: FieldDefinition[] = [
  {
    name: "text_field",
    label: "Simple text field",
    placeholder: "Please enter ...",
    inputType: "text",
    validation: { required: true }
  },
  {
    name: "number_field",
    label: "Simple number field",
    placeholder: "Please enter ...",
    inputType: "number",
    validation: { required: true }
  },
  {
    name: "dropdown_input",
    label: "Dropdown component",
    placeholder: "Select ...",
    inputType: "select",
    validation: { required: true },
    options: [
      { title: "Option 1", value: "1" },
      { title: "Option 2", value: "2" },
      { title: "Option 3", value: "3" }
    ]
  },
  {
    name: "multi_dropdown_input",
    label: "Multi-Select Dropdown component",
    placeholder: "Select ...",
    inputType: "select",
    validation: { required: true },
    multiChoice: true,
    options: [
      { title: "Option 1", value: "1" },
      { title: "Option 2", value: "2" },
      { title: "Option 3", value: "3" },
      { title: "Option 4", value: "4" }
    ]
  },
  {
    name: "field_country",
    label: "Country selector",
    placeholder: "Select country ...",
    inputType: "select",
    validation: { required: true },
    options: [
      { title: "United States", value: "USA" },
      { title: "México", value: "MEX" },
      { title: "Colombia", value: "COL" }
    ]
  },
  {
    name: "select_input",
    label: "Select component",
    placeholder: "Select ...",
    inputType: "radio",
    validation: { required: true },
    options: [
      { title: "Option 1", value: "1" },
      { title: "Option 2", value: "2" },
      { title: "Option 3", value: "3" }
    ]
  }
];

export const Default: Story = {
  render: (args: Props) => {
    const formHook = useForm();

    return (
      <QueryClientProvider client={client}>
        <div className="flex w-full justify-center bg-background px-3">
          <Component {...args} formHook={formHook} />
        </div>
      </QueryClientProvider>
    );
  },
  args: {
    fields: fields,
    onChange() {}
  }
};
