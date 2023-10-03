import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import { getCountriesOptions } from "@/constants/options/countries";

import { FieldType, FormField } from "../WizardForm/types";
import Component, { SimpleFormProps as Props } from "./SimpleForm";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Form/Simple",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const client = new QueryClient();
const fields: FormField[] = [
  {
    name: "text_field",
    label: "Simple text field",
    placeholder: "Please enter ...",
    type: FieldType.Input,
    validation: yup.string().required(),
    fieldProps: { type: "text", required: true }
  },
  {
    name: "number_field",
    label: "Simple number field",
    placeholder: "Please enter ...",
    type: FieldType.Input,
    validation: yup.number().required(),
    fieldProps: { type: "number", required: true }
  },
  {
    name: "dropdown_input",
    label: "Dropdown component",
    placeholder: "Select ...",
    type: FieldType.Dropdown,
    validation: yup.string().required(),
    fieldProps: {
      required: true,
      options: [
        { title: "Option 1", value: "1" },
        { title: "Option 2", value: "2" },
        { title: "Option 3", value: "3" }
      ]
    }
  },
  {
    name: "multi_dropdown_input",
    label: "Multi-Select Dropdown component",
    placeholder: "Select ...",
    type: FieldType.Dropdown,
    validation: yup.array().min(1).required(),
    fieldProps: {
      multiSelect: true,
      required: true,
      options: [
        { title: "Option 1", value: "1" },
        { title: "Option 2", value: "2" },
        { title: "Option 3", value: "3" },
        { title: "Option 4", value: "4" }
      ]
    }
  },
  {
    name: "field_country",
    label: "Country selector",
    placeholder: "Select country ...",
    type: FieldType.Dropdown,
    validation: yup.string().required(),
    fieldProps: { options: getCountriesOptions(), required: true }
  },
  {
    name: "select_input",
    label: "Select component",
    placeholder: "Select ...",
    type: FieldType.Select,
    validation: yup.string().required(),
    fieldProps: {
      required: true,
      options: [
        { title: "Option 1", value: "1" },
        { title: "Option 2", value: "2" },
        { title: "Option 3", value: "3" }
      ]
    }
  },
  {
    name: "multi_select_input",
    label: "Multi-Select component",
    placeholder: "Select ...",
    type: FieldType.Select,
    validation: yup.array().min(1).required(),
    fieldProps: {
      multiSelect: true,
      required: true,
      options: [
        { title: "Option 1", value: "1" },
        { title: "Option 2", value: "2" },
        { title: "Option 3", value: "3" },
        { title: "Option 4", value: "4" }
      ]
    }
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
