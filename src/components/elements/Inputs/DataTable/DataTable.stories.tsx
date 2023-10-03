import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import {
  getFundingTypeFields,
  getFundingTypeTableHeaders
} from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";

import Component, { DataTableProps as Props } from "./DataTable";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/DataTable",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const client = new QueryClient();

export const Default: Story = {
  render: (args: Props<any>) => {
    const [value, setValue] = useState([]);
    return (
      <QueryClientProvider client={client}>
        <Component {...args} value={value} onChange={setValue} />
      </QueryClientProvider>
    );
  },
  args: {
    label: "What are your funding sources?",
    description: "Add a description for jobs created.",
    addButtonCaption: "Add funding source",

    fields: getFundingTypeFields(),
    tableHeaders: getFundingTypeTableHeaders() as any[]
  }
};
