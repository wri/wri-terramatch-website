import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import ToolbarTable from "./ToolbarTable";

const meta: Meta<typeof ToolbarTable> = {
  title: "Redesign Components/Navigation/Toolbar/Toolbar Table",
  component: ToolbarTable,
  tags: ["autodocs"],
  parameters: {
    layout: "padded"
  },
  argTypes: {
    search: {
      description: "Search configuration with options and display settings"
    },
    filters: {
      description: "Array of MultiActionButton filters"
    },
    button: {
      description: "Button configuration for the right side of the toolbar"
    }
  }
};

export default meta;
type Story = StoryObj<typeof ToolbarTable>;

// Search options
const searchOptions = [
  { label: "Project Alpha", value: "alpha", caption: "Active project" },
  { label: "Project Beta", value: "beta", caption: "Draft project" },
  { label: "Project Gamma", value: "gamma", caption: "Published project" },
  { label: "Site One", value: "site1", caption: "Active site" },
  { label: "Site Two", value: "site2", caption: "Inactive site" }
];

// Default filter configurations
const statusFilter = {
  variant: "secondary" as const,
  mainActionLabel: "All Statuses",
  mainActionOnClick: () => console.log("Status filter clicked"),
  otherActions: [
    {
      label: "Published",
      value: "published",
      onClick: () => console.log("Published selected")
    },
    {
      label: "Draft",
      value: "draft",
      onClick: () => console.log("Draft selected")
    },
    {
      label: "Archived",
      value: "archived",
      onClick: () => console.log("Archived selected")
    }
  ]
};

const typeFilter = {
  variant: "secondary" as const,
  mainActionLabel: "All Types",
  mainActionOnClick: () => console.log("Type filter clicked"),
  otherActions: [
    {
      label: "Project",
      value: "project",
      onClick: () => console.log("Project selected")
    },
    {
      label: "Site",
      value: "site",
      onClick: () => console.log("Site selected")
    },
    {
      label: "Organization",
      value: "organization",
      onClick: () => console.log("Organization selected")
    }
  ]
};

const regionFilter = {
  variant: "secondary" as const,
  mainActionLabel: "All Regions",
  mainActionOnClick: () => console.log("Region filter clicked"),
  otherActions: [
    {
      label: "Africa",
      value: "africa",
      onClick: () => console.log("Africa selected")
    },
    {
      label: "Asia",
      value: "asia",
      onClick: () => console.log("Asia selected")
    },
    {
      label: "Americas",
      value: "americas",
      onClick: () => console.log("Americas selected")
    }
  ]
};

// Default button configuration
const defaultButton = {
  variant: "primary" as const,
  children: "New Item",
  onClick: () => console.log("Button clicked")
};

export const WithFiltersOnly: Story = {
  args: {
    filters: [statusFilter, typeFilter],
    button: defaultButton
  }
};

export const WithSearchOnly: Story = {
  args: {
    search: {
      placeholder: "Search projects, sites, organizations...",
      label: "Search",
      options: searchOptions,
      displayResults: "list"
    },
    filters: [],
    button: defaultButton
  }
};

export const Complete: Story = {
  args: {
    search: {
      placeholder: "Search projects, sites, organizations...",
      label: "Search",
      options: searchOptions,
      displayResults: "list"
    },
    filters: [statusFilter, typeFilter],
    button: defaultButton
  }
};

export const WithPrimaryFilters: Story = {
  args: {
    filters: [
      {
        variant: "primary" as const,
        mainActionLabel: "Status: All",
        mainActionOnClick: () => console.log("Status filter clicked"),
        otherActions: [
          {
            label: "Published",
            value: "published",
            onClick: () => console.log("Published selected")
          },
          {
            label: "Draft",
            value: "draft",
            onClick: () => console.log("Draft selected")
          }
        ]
      },
      {
        variant: "primary" as const,
        mainActionLabel: "Type: All",
        mainActionOnClick: () => console.log("Type filter clicked"),
        otherActions: [
          {
            label: "Project",
            value: "project",
            onClick: () => console.log("Project selected")
          },
          {
            label: "Site",
            value: "site",
            onClick: () => console.log("Site selected")
          }
        ]
      }
    ],
    button: defaultButton
  }
};

export const SmallSearchWithMultipleFilters: Story = {
  args: {
    search: {
      placeholder: "Search...",
      label: "Search",
      options: searchOptions,
      displayResults: "list"
    },
    filters: [statusFilter, typeFilter, regionFilter],
    button: defaultButton
  }
};

export const WithDisabledSearch: Story = {
  args: {
    search: {
      placeholder: "Search projects, sites, organizations...",
      label: "Search",
      options: searchOptions,
      displayResults: "list",
      disabled: true
    },
    filters: [statusFilter],
    button: defaultButton
  }
};

export const WithLoadingSearch: Story = {
  args: {
    search: {
      placeholder: "Search projects, sites, organizations...",
      label: "Search",
      options: searchOptions,
      displayResults: "list",
      isLoading: true
    },
    filters: [statusFilter],
    button: defaultButton
  }
};

export const WithSecondaryButton: Story = {
  args: {
    filters: [statusFilter, typeFilter],
    button: {
      variant: "secondary" as const,
      children: "Cancel",
      onClick: () => console.log("Cancel clicked")
    }
  }
};

export const WithOutlineButton: Story = {
  args: {
    filters: [statusFilter],
    button: {
      variant: "outline" as const,
      children: "Export",
      onClick: () => console.log("Export clicked")
    }
  }
};

export const WithButtonIcon: Story = {
  args: {
    filters: [statusFilter],
    button: {
      variant: "primary" as const,
      children: "Add New",
      leftIcon: <Icon name={IconNames.PLUS} width={16} />,
      onClick: () => console.log("Add New clicked")
    }
  }
};

export const WithSmallFilters: Story = {
  args: {
    filters: [
      {
        ...statusFilter,
        size: "small" as const
      },
      {
        ...typeFilter,
        size: "small" as const
      }
    ],
    button: {
      ...defaultButton,
      size: "small" as const
    }
  }
};

export const WithDisabledFilters: Story = {
  args: {
    filters: [
      {
        ...statusFilter,
        disabled: true
      },
      {
        ...typeFilter,
        disabled: true
      }
    ],
    button: {
      ...defaultButton,
      disabled: true
    }
  }
};

export const Interactive: Story = {
  render: () => {
    const [statusLabel, setStatusLabel] = useState("All Statuses");
    const [typeLabel, setTypeLabel] = useState("All Types");

    return (
      <ToolbarTable
        search={{
          placeholder: "Search projects, sites, organizations...",
          label: "Search",
          options: searchOptions,
          displayResults: "list"
        }}
        filters={[
          {
            variant: "secondary" as const,
            mainActionLabel: statusLabel,
            mainActionOnClick: () => console.log("Status filter clicked"),
            otherActions: [
              {
                label: "Published",
                value: "published",
                onClick: () => setStatusLabel("Published")
              },
              {
                label: "Draft",
                value: "draft",
                onClick: () => setStatusLabel("Draft")
              },
              {
                label: "Archived",
                value: "archived",
                onClick: () => setStatusLabel("Archived")
              }
            ]
          },
          {
            variant: "secondary" as const,
            mainActionLabel: typeLabel,
            mainActionOnClick: () => console.log("Type filter clicked"),
            otherActions: [
              {
                label: "Project",
                value: "project",
                onClick: () => setTypeLabel("Project")
              },
              {
                label: "Site",
                value: "site",
                onClick: () => setTypeLabel("Site")
              },
              {
                label: "Organization",
                value: "organization",
                onClick: () => setTypeLabel("Organization")
              }
            ]
          }
        ]}
        button={{
          variant: "primary" as const,
          children: "New Item",
          onClick: () => console.log("Button clicked")
        }}
      />
    );
  }
};

export const Minimal: Story = {
  args: {
    filters: [
      {
        variant: "secondary" as const,
        mainActionLabel: "Filter",
        mainActionOnClick: () => console.log("Filter clicked"),
        otherActions: [
          {
            label: "Option 1",
            value: "1",
            onClick: () => console.log("Option 1 selected")
          },
          {
            label: "Option 2",
            value: "2",
            onClick: () => console.log("Option 2 selected")
          }
        ]
      }
    ],
    button: defaultButton
  }
};
