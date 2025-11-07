import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useT } from "@transifex/react";
import { useMemo, useState } from "react";

import {
  getFundingTypeQuestions,
  getFundingTypeTableColumns
} from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import { useLocalStepsProvider } from "@/context/wizardForm.provider";

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
    const t = useT();
    const { columns, steps } = useMemo(
      () => ({
        columns: getFundingTypeTableColumns(t),
        steps: [{ id: "dataTable", fields: getFundingTypeQuestions(t) }]
      }),
      [t]
    );
    const provider = useLocalStepsProvider(steps);
    return (
      <QueryClientProvider client={client}>
        <Component {...args} tableColumns={columns} fieldsProvider={provider} value={value} onChange={setValue} />
      </QueryClientProvider>
    );
  },
  args: {
    label: "What are your funding sources?",
    description: "Add a description for jobs created.",
    addButtonCaption: "Add funding source"
  }
};
