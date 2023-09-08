import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import * as yup from "yup";

import { FieldType } from "@/components/extensive/WizardForm/types";

import Component, { InputTableProps as Props } from "./InputTable";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/InputTable",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const client = new QueryClient();

export const Default: Story = {
  render: (args: Props) => {
    const [value, setValue] = useState({});
    return (
      <QueryClientProvider client={client}>
        <Component {...args} value={value} onChange={setValue} />
      </QueryClientProvider>
    );
  },
  args: {
    headers: ["Breakdown", "Percentage(%)"],
    rows: [
      {
        label: "% New paid full-time hobs",
        name: "full-time-jobs",
        placeholder: "Enter a value",
        validation: yup.number().required(),
        type: FieldType.Input,
        fieldProps: { type: "number" }
      },
      {
        label: "% New paid part-time jobs",
        name: "part-time-jobs",
        placeholder: "Enter a value",
        validation: yup.number().required(),
        type: FieldType.Input,
        fieldProps: { type: "number" }
      },
      {
        label: "% of women employees",
        name: "women-employees",
        placeholder: "Enter a value",
        validation: yup.number().required(),
        type: FieldType.Input,
        fieldProps: { type: "number" }
      }
    ]
  }
};
