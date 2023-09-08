import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Button from "@/components/elements/Button/Button";
import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Text from "@/components/elements/Text/Text";

import Component, { TableProps as Props } from "./Table";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Table",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const client = new QueryClient();

export const Default: Story = {
  render: (args: Props<any>) => {
    return (
      <QueryClientProvider client={client}>
        <Component {...args} />
      </QueryClientProvider>
    );
  },
  args: {
    columns: [
      {
        accessorKey: "fundingType",
        header: "Funding type",
        enableSorting: false
      },
      {
        accessorKey: "fundingSource",
        header: "Funding source"
      },
      {
        accessorKey: "fundingAmount",
        header: "Funding amount"
      },
      {
        accessorKey: "status",
        cell: (props: any) => (
          <StatusPill status={props.getValue()} className="w-fit">
            <Text variant="text-bold-caption-100">{props.getValue()}</Text>
          </StatusPill>
        ),
        header: "Status",
        enableSorting: false
      },
      {
        accessorKey: "id",
        header: "",
        cell: () => <Button>View</Button>,
        meta: { align: "right" },
        enableSorting: false
      }
    ],
    data: [
      { id: "1", fundingType: "Cash", fundingSource: "VISA", fundingAmount: 2000, status: "error" },
      { id: "2", fundingType: "Cash", fundingSource: "Master Card", fundingAmount: 1000, status: "awaiting" },
      { id: "3", fundingType: "Credit", fundingSource: "American Express", fundingAmount: 1500, status: "warning" },
      { id: "4", fundingType: "Cash", fundingSource: "VISA", fundingAmount: 7500, status: "error" },
      { id: "5", fundingType: "Credit", fundingSource: "American Express", fundingAmount: 1900, status: "edit" },
      { id: "6", fundingType: "Credit", fundingSource: "Master Card", fundingAmount: 5000, status: "success" },
      { id: "7", fundingType: "Credit", fundingSource: "VISA", fundingAmount: 100000, status: "error" },
      { id: "8", fundingType: "Cash", fundingSource: "VISA", fundingAmount: 60000, status: "awaiting" },
      { id: "9", fundingType: "Credit", fundingSource: "Master Card", fundingAmount: 15000, status: "warning" },
      { id: "10", fundingType: "Cash", fundingSource: "VISA", fundingAmount: 1510000, status: "success" },
      { id: "11", fundingType: "Credit", fundingSource: "Master Card", fundingAmount: 10, status: "error" },
      { id: "12", fundingType: "Credit", fundingSource: "VISA", fundingAmount: 10, status: "success" },
      { id: "13", fundingType: "Credit", fundingSource: "Master Card", fundingAmount: 54, status: "awaiting" }
    ]
  }
};
