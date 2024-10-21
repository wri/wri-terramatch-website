import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import Button from "@/components/elements/Button/Button";
import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Text from "@/components/elements/Text/Text";

import Component, { TableProps as Props, TableState } from "./Table";
import {
  VARIANT_TABLE_AIRTABLE,
  VARIANT_TABLE_AIRTABLE_DASHBOARD,
  VARIANT_TABLE_BORDER,
  VARIANT_TABLE_BORDER_ALL,
  VARIANT_TABLE_DASHBOARD_COUNTRIES,
  VARIANT_TABLE_DASHBOARD_COUNTRIES_MODAL,
  VARIANT_TABLE_ORGANISATION,
  VARIANT_TABLE_PRIMARY,
  VARIANT_TABLE_SECONDARY,
  VARIANT_TABLE_SECONDARY_WHITE,
  VARIANT_TABLE_SITE_POLYGON_REVIEW,
  VARIANT_TABLE_VERSION
} from "./TableVariants";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Table",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const client = new QueryClient();

export const Default: Story = {
  render: (args: Props<any>) => {
    const [tableState, setTableState] = useState<TableState>({ sorting: [], filters: [] });

    return (
      <QueryClientProvider client={client}>
        <Component
          {...args}
          onTableStateChange={setTableState}
          data={tableData.filter((data: any) => {
            for (const filter of tableState.filters) {
              if (filter.filter.type === "dropDown" && data?.[filter.filter.accessorKey] !== filter.value) {
                return false;
              } else if (filter.filter.type === "search") {
                //Weak implementation of full text search for demo purpose only
                const values: any[] = Object.values(data);
                for (const val of values) {
                  if (`${val}`.toLowerCase().includes(filter.value)) {
                    return true;
                  }
                }
                return false;
              }
            }
            return true;
          })}
        >
          <Button>Create</Button>
        </Component>
      </QueryClientProvider>
    );
  },
  args: {
    variant: VARIANT_TABLE_SECONDARY,
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
    columnFilters: [
      { type: "search", accessorKey: "fundingType", placeholder: "Search" },
      {
        type: "dropDown",
        accessorKey: "fundingSource",
        label: "Funding source",

        options: [
          {
            title: "VISA",
            value: "VISA"
          },
          {
            title: "Master Card",
            value: "Master Card"
          },
          {
            title: "American Express",
            value: "American Express"
          }
        ]
      }
    ]
  }
};

export const Primary: Story = {
  render: (args: Props<any>) => {
    const [tableState, setTableState] = useState<TableState>({ sorting: [], filters: [] });

    return (
      <QueryClientProvider client={client}>
        <Component
          {...args}
          onTableStateChange={setTableState}
          data={tableData.filter((data: any) => {
            for (const filter of tableState.filters) {
              if (filter.filter.type === "dropDown" && data?.[filter.filter.accessorKey] !== filter.value) {
                return false;
              } else if (filter.filter.type === "search") {
                //Weak implementation of full text search for demo purpose only
                const values: any[] = Object.values(data);
                for (const val of values) {
                  if (`${val}`.toLowerCase().includes(filter.value)) {
                    return true;
                  }
                }
                return false;
              }
            }
            return true;
          })}
        >
          <Button>Create</Button>
        </Component>
      </QueryClientProvider>
    );
  },
  args: {
    variant: VARIANT_TABLE_PRIMARY,
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
    columnFilters: [
      { type: "search", accessorKey: "fundingType", placeholder: "Search" },
      {
        type: "dropDown",
        accessorKey: "fundingSource",
        label: "Funding source",

        options: [
          {
            title: "VISA",
            value: "VISA"
          },
          {
            title: "Master Card",
            value: "Master Card"
          },
          {
            title: "American Express",
            value: "American Express"
          }
        ]
      }
    ]
  }
};

export const SecundaryWhite: Story = {
  render: (args: Props<any>) => {
    const [tableState, setTableState] = useState<TableState>({ sorting: [], filters: [] });

    return (
      <QueryClientProvider client={client}>
        <Component
          {...args}
          onTableStateChange={setTableState}
          data={tableData.filter((data: any) => {
            for (const filter of tableState.filters) {
              if (filter.filter.type === "dropDown" && data?.[filter.filter.accessorKey] !== filter.value) {
                return false;
              } else if (filter.filter.type === "search") {
                //Weak implementation of full text search for demo purpose only
                const values: any[] = Object.values(data);
                for (const val of values) {
                  if (`${val}`.toLowerCase().includes(filter.value)) {
                    return true;
                  }
                }
                return false;
              }
            }
            return true;
          })}
        >
          <Button>Create</Button>
        </Component>
      </QueryClientProvider>
    );
  },
  args: {
    variant: VARIANT_TABLE_SECONDARY_WHITE,
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
    columnFilters: [
      { type: "search", accessorKey: "fundingType", placeholder: "Search" },
      {
        type: "dropDown",
        accessorKey: "fundingSource",
        label: "Funding source",

        options: [
          {
            title: "VISA",
            value: "VISA"
          },
          {
            title: "Master Card",
            value: "Master Card"
          },
          {
            title: "American Express",
            value: "American Express"
          }
        ]
      }
    ]
  }
};

export const TableBorder: Story = {
  render: (args: Props<any>) => {
    const [tableState, setTableState] = useState<TableState>({ sorting: [], filters: [] });

    return (
      <QueryClientProvider client={client}>
        <Component
          {...args}
          onTableStateChange={setTableState}
          data={tableData.filter((data: any) => {
            for (const filter of tableState.filters) {
              if (filter.filter.type === "dropDown" && data?.[filter.filter.accessorKey] !== filter.value) {
                return false;
              } else if (filter.filter.type === "search") {
                //Weak implementation of full text search for demo purpose only
                const values: any[] = Object.values(data);
                for (const val of values) {
                  if (`${val}`.toLowerCase().includes(filter.value)) {
                    return true;
                  }
                }
                return false;
              }
            }
            return true;
          })}
        >
          <Button>Create</Button>
        </Component>
      </QueryClientProvider>
    );
  },
  args: {
    variant: VARIANT_TABLE_BORDER,
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
    columnFilters: [
      { type: "search", accessorKey: "fundingType", placeholder: "Search" },
      {
        type: "dropDown",
        accessorKey: "fundingSource",
        label: "Funding source",

        options: [
          {
            title: "VISA",
            value: "VISA"
          },
          {
            title: "Master Card",
            value: "Master Card"
          },
          {
            title: "American Express",
            value: "American Express"
          }
        ]
      }
    ]
  }
};

export const TableBorderAll: Story = {
  render: (args: Props<any>) => {
    const [tableState, setTableState] = useState<TableState>({ sorting: [], filters: [] });

    return (
      <QueryClientProvider client={client}>
        <Component
          {...args}
          onTableStateChange={setTableState}
          data={tableData.filter((data: any) => {
            for (const filter of tableState.filters) {
              if (filter.filter.type === "dropDown" && data?.[filter.filter.accessorKey] !== filter.value) {
                return false;
              } else if (filter.filter.type === "search") {
                //Weak implementation of full text search for demo purpose only
                const values: any[] = Object.values(data);
                for (const val of values) {
                  if (`${val}`.toLowerCase().includes(filter.value)) {
                    return true;
                  }
                }
                return false;
              }
            }
            return true;
          })}
        >
          <Button>Create</Button>
        </Component>
      </QueryClientProvider>
    );
  },
  args: {
    variant: VARIANT_TABLE_BORDER_ALL,
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
    columnFilters: [
      { type: "search", accessorKey: "fundingType", placeholder: "Search" },
      {
        type: "dropDown",
        accessorKey: "fundingSource",
        label: "Funding source",

        options: [
          {
            title: "VISA",
            value: "VISA"
          },
          {
            title: "Master Card",
            value: "Master Card"
          },
          {
            title: "American Express",
            value: "American Express"
          }
        ]
      }
    ]
  }
};

export const TableAirtable: Story = {
  render: (args: Props<any>) => {
    const [tableState, setTableState] = useState<TableState>({ sorting: [], filters: [] });

    return (
      <QueryClientProvider client={client}>
        <Component
          {...args}
          onTableStateChange={setTableState}
          data={tableData.filter((data: any) => {
            for (const filter of tableState.filters) {
              if (filter.filter.type === "dropDown" && data?.[filter.filter.accessorKey] !== filter.value) {
                return false;
              } else if (filter.filter.type === "search") {
                //Weak implementation of full text search for demo purpose only
                const values: any[] = Object.values(data);
                for (const val of values) {
                  if (`${val}`.toLowerCase().includes(filter.value)) {
                    return true;
                  }
                }
                return false;
              }
            }
            return true;
          })}
        >
          <Button>Create</Button>
        </Component>
      </QueryClientProvider>
    );
  },
  args: {
    variant: VARIANT_TABLE_AIRTABLE,
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
    columnFilters: [
      { type: "search", accessorKey: "fundingType", placeholder: "Search" },
      {
        type: "dropDown",
        accessorKey: "fundingSource",
        label: "Funding source",

        options: [
          {
            title: "VISA",
            value: "VISA"
          },
          {
            title: "Master Card",
            value: "Master Card"
          },
          {
            title: "American Express",
            value: "American Express"
          }
        ]
      }
    ]
  }
};
export const TableSitePolygon: Story = {
  render: (args: Props<any>) => {
    const [tableState, setTableState] = useState<TableState>({ sorting: [], filters: [] });

    return (
      <QueryClientProvider client={client}>
        <Component
          {...args}
          onTableStateChange={setTableState}
          data={tableData.filter((data: any) => {
            for (const filter of tableState.filters) {
              if (filter.filter.type === "dropDown" && data?.[filter.filter.accessorKey] !== filter.value) {
                return false;
              } else if (filter.filter.type === "search") {
                //Weak implementation of full text search for demo purpose only
                const values: any[] = Object.values(data);
                for (const val of values) {
                  if (`${val}`.toLowerCase().includes(filter.value)) {
                    return true;
                  }
                }
                return false;
              }
            }
            return true;
          })}
        >
          <Button>Create</Button>
        </Component>
      </QueryClientProvider>
    );
  },
  args: {
    variant: VARIANT_TABLE_SITE_POLYGON_REVIEW,
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
    columnFilters: [
      { type: "search", accessorKey: "fundingType", placeholder: "Search" },
      {
        type: "dropDown",
        accessorKey: "fundingSource",
        label: "Funding source",

        options: [
          {
            title: "VISA",
            value: "VISA"
          },
          {
            title: "Master Card",
            value: "Master Card"
          },
          {
            title: "American Express",
            value: "American Express"
          }
        ]
      }
    ]
  }
};

export const TableVersion: Story = {
  render: (args: Props<any>) => {
    const [tableState, setTableState] = useState<TableState>({ sorting: [], filters: [] });

    return (
      <QueryClientProvider client={client}>
        <div className="bg-neutral-600">
          <Component
            {...args}
            onTableStateChange={setTableState}
            data={tableData.filter((data: any) => {
              for (const filter of tableState.filters) {
                if (filter.filter.type === "dropDown" && data?.[filter.filter.accessorKey] !== filter.value) {
                  return false;
                } else if (filter.filter.type === "search") {
                  //Weak implementation of full text search for demo purpose only
                  const values: any[] = Object.values(data);
                  for (const val of values) {
                    if (`${val}`.toLowerCase().includes(filter.value)) {
                      return true;
                    }
                  }
                  return false;
                }
              }
              return true;
            })}
          >
            <Button>Create</Button>
          </Component>
        </div>
      </QueryClientProvider>
    );
  },
  args: {
    variant: VARIANT_TABLE_VERSION,
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
    columnFilters: [
      { type: "search", accessorKey: "fundingType", placeholder: "Search" },
      {
        type: "dropDown",
        accessorKey: "fundingSource",
        label: "Funding source",

        options: [
          {
            title: "VISA",
            value: "VISA"
          },
          {
            title: "Master Card",
            value: "Master Card"
          },
          {
            title: "American Express",
            value: "American Express"
          }
        ]
      }
    ]
  }
};

export const TableOrganization: Story = {
  render: (args: Props<any>) => {
    const [tableState, setTableState] = useState<TableState>({ sorting: [], filters: [] });

    return (
      <QueryClientProvider client={client}>
        <div className="bg-neutral-600">
          <Component
            {...args}
            onTableStateChange={setTableState}
            data={tableData.filter((data: any) => {
              for (const filter of tableState.filters) {
                if (filter.filter.type === "dropDown" && data?.[filter.filter.accessorKey] !== filter.value) {
                  return false;
                } else if (filter.filter.type === "search") {
                  //Weak implementation of full text search for demo purpose only
                  const values: any[] = Object.values(data);
                  for (const val of values) {
                    if (`${val}`.toLowerCase().includes(filter.value)) {
                      return true;
                    }
                  }
                  return false;
                }
              }
              return true;
            })}
          >
            <Button>Create</Button>
          </Component>
        </div>
      </QueryClientProvider>
    );
  },
  args: {
    variant: VARIANT_TABLE_ORGANISATION,
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
    columnFilters: [
      { type: "search", accessorKey: "fundingType", placeholder: "Search" },
      {
        type: "dropDown",
        accessorKey: "fundingSource",
        label: "Funding source",

        options: [
          {
            title: "VISA",
            value: "VISA"
          },
          {
            title: "Master Card",
            value: "Master Card"
          },
          {
            title: "American Express",
            value: "American Express"
          }
        ]
      }
    ]
  }
};
export const TableDashboardCountries: Story = {
  render: (args: Props<any>) => {
    const [tableState, setTableState] = useState<TableState>({ sorting: [], filters: [] });

    return (
      <QueryClientProvider client={client}>
        <div className="bg-neutral-600">
          <Component
            {...args}
            onTableStateChange={setTableState}
            data={tableData.filter((data: any) => {
              for (const filter of tableState.filters) {
                if (filter.filter.type === "dropDown" && data?.[filter.filter.accessorKey] !== filter.value) {
                  return false;
                } else if (filter.filter.type === "search") {
                  //Weak implementation of full text search for demo purpose only
                  const values: any[] = Object.values(data);
                  for (const val of values) {
                    if (`${val}`.toLowerCase().includes(filter.value)) {
                      return true;
                    }
                  }
                  return false;
                }
              }
              return true;
            })}
          >
            <Button>Create</Button>
          </Component>
        </div>
      </QueryClientProvider>
    );
  },
  args: {
    variant: VARIANT_TABLE_DASHBOARD_COUNTRIES,
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
    columnFilters: [
      { type: "search", accessorKey: "fundingType", placeholder: "Search" },
      {
        type: "dropDown",
        accessorKey: "fundingSource",
        label: "Funding source",

        options: [
          {
            title: "VISA",
            value: "VISA"
          },
          {
            title: "Master Card",
            value: "Master Card"
          },
          {
            title: "American Express",
            value: "American Express"
          }
        ]
      }
    ]
  }
};
export const TableDashboardCountriesModal: Story = {
  render: (args: Props<any>) => {
    const [tableState, setTableState] = useState<TableState>({ sorting: [], filters: [] });

    return (
      <QueryClientProvider client={client}>
        <div className="bg-neutral-600">
          <Component
            {...args}
            onTableStateChange={setTableState}
            data={tableData.filter((data: any) => {
              for (const filter of tableState.filters) {
                if (filter.filter.type === "dropDown" && data?.[filter.filter.accessorKey] !== filter.value) {
                  return false;
                } else if (filter.filter.type === "search") {
                  //Weak implementation of full text search for demo purpose only
                  const values: any[] = Object.values(data);
                  for (const val of values) {
                    if (`${val}`.toLowerCase().includes(filter.value)) {
                      return true;
                    }
                  }
                  return false;
                }
              }
              return true;
            })}
          >
            <Button>Create</Button>
          </Component>
        </div>
      </QueryClientProvider>
    );
  },
  args: {
    variant: VARIANT_TABLE_DASHBOARD_COUNTRIES_MODAL,
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
    columnFilters: [
      { type: "search", accessorKey: "fundingType", placeholder: "Search" },
      {
        type: "dropDown",
        accessorKey: "fundingSource",
        label: "Funding source",

        options: [
          {
            title: "VISA",
            value: "VISA"
          },
          {
            title: "Master Card",
            value: "Master Card"
          },
          {
            title: "American Express",
            value: "American Express"
          }
        ]
      }
    ]
  }
};
export const TableAirtableDashboard: Story = {
  render: (args: Props<any>) => {
    const [tableState, setTableState] = useState<TableState>({ sorting: [], filters: [] });

    return (
      <QueryClientProvider client={client}>
        <div className="bg-neutral-600">
          <Component
            {...args}
            onTableStateChange={setTableState}
            data={tableData.filter((data: any) => {
              for (const filter of tableState.filters) {
                if (filter.filter.type === "dropDown" && data?.[filter.filter.accessorKey] !== filter.value) {
                  return false;
                } else if (filter.filter.type === "search") {
                  //Weak implementation of full text search for demo purpose only
                  const values: any[] = Object.values(data);
                  for (const val of values) {
                    if (`${val}`.toLowerCase().includes(filter.value)) {
                      return true;
                    }
                  }
                  return false;
                }
              }
              return true;
            })}
          >
            <Button>Create</Button>
          </Component>
        </div>
      </QueryClientProvider>
    );
  },
  args: {
    variant: VARIANT_TABLE_AIRTABLE_DASHBOARD,
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
    columnFilters: [
      { type: "search", accessorKey: "fundingType", placeholder: "Search" },
      {
        type: "dropDown",
        accessorKey: "fundingSource",
        label: "Funding source",

        options: [
          {
            title: "VISA",
            value: "VISA"
          },
          {
            title: "Master Card",
            value: "Master Card"
          },
          {
            title: "American Express",
            value: "American Express"
          }
        ]
      }
    ]
  }
};

const tableData = [
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
];
