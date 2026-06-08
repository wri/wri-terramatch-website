import { Meta, StoryObj } from "@storybook/react";

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
      description:
        "Search input configuration including placeholder, count label, query handlers and autocomplete options"
    },
    filters: {
      description:
        "Array of MultiActionButton configs rendered as 'Filter by:' dropdowns. When provided, hides the Add Filter button"
    },
    selectedFilters: {
      description: "Active filter tags shown as dismissible chips in the toolbar"
    },
    button: {
      description: "Optional primary action button rendered on the right side of the toolbar"
    },
    tooltipContent: {
      description: "Text shown inside the info tooltip icon on the right side"
    },
    showClearFilters: {
      description: "Controls visibility of the Clear All Filters borderless button"
    },
    onClickFilterButton: {
      action: "filterButtonClicked",
      description: "Callback fired when the Add Filter / Filter (n) button is clicked"
    },
    onClearFilters: {
      action: "clearFiltersClicked",
      description: "Callback fired when Clear All Filters is clicked"
    }
  }
};

export default meta;
type Story = StoryObj<typeof ToolbarTable>;

const baseSearch = {
  placeholder: "Search",
  label: "results",
  count: 42,
  options: [],
  onQueryChange: (q: string) => console.log("query:", q),
  onSearchSubmit: (q: string) => console.log("submit:", q)
};

export const Default: Story = {
  name: "With Selected Filter Tags",
  args: {
    search: { ...baseSearch, count: 0 },
    className: "w-full",
    classNameContentLeft: "w-full",
    showClearFilters: false,
    onClearFilters: () => console.log("clear filters"),
    onClickFilterButton: () => console.log("open filter panel")
  }
};

export const WithSelectedFilters: Story = {
  name: "With Selected Filter Tags",
  args: {
    search: { ...baseSearch, count: 12 },
    showClearFilters: true,
    className: "w-full",
    classNameContentLeft: "w-full",
    onClearFilters: () => console.log("clear filters"),
    onClickFilterButton: () => console.log("open filter panel"),
    selectedFilters: [
      { category: "Category", label: ["Filter A", "Filter B"], onRemove: () => console.log("remove status") },
      { category: "Country", label: "mm/yyyy - mm/yyyy", onRemove: () => console.log("remove country") },
      { category: "Organisation", label: "Label", onRemove: () => console.log("remove org") }
    ]
  }
};

export const WithManySelectedFilters: Story = {
  name: "With Many Filter Tags (scrollable)",
  args: {
    search: { ...baseSearch, count: 3 },
    showClearFilters: true,
    className: "w-full",
    classNameContentLeft: "w-full",
    onClearFilters: () => console.log("clear filters"),
    onClickFilterButton: () => console.log("open filter panel"),
    selectedFilters: [
      { category: "Category", label: ["Filter A", "Filter B"], onRemove: () => console.log("remove status") },
      { category: "Category", label: ["Filter A", "Filter B"], onRemove: () => console.log("remove status") },
      { category: "Country", label: "mm/yyyy - mm/yyyy", onRemove: () => console.log("remove country") },
      { category: "Organisation", label: "Label", onRemove: () => console.log("remove org") },
      { category: "Organisation", label: "Label", onRemove: () => console.log("remove org") }
    ]
  }
};
