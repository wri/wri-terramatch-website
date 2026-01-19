import { Meta, StoryObj } from "@storybook/react";

import Search from "./Search";

const mockOptions = [
  { id: "1", label: "Apple", caption: "Fruit" },
  { id: "2", label: "Banana", caption: "Fruit" },
  { id: "3", label: "Carrot", caption: "Vegetable" }
  //   { id: "4", label: "Broccoli", caption: "Vegetable" },
  //   { id: "5", label: "Orange", caption: "Fruit" },
  //   { id: "6", label: "Tomato", caption: "Vegetable" }
];

const meta: Meta<typeof Search> = {
  title: "Redesign Components/Forms/Actions/Search",
  component: Search,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["default", "small"]
    },
    disabled: {
      control: "boolean"
    },
    placeholder: {
      control: "text"
    },
    displayResults: {
      control: "select",
      options: ["text", "list", "custom", "none"]
    },
    isLoading: {
      control: "boolean"
    }
  }
};

export default meta;
type Story = StoryObj<typeof Search>;

// Default - Shows basic search with text results
export const Default: Story = {
  args: {
    placeholder: "Search items...",
    options: mockOptions,
    displayResults: "text",
    onSelect: option => {
      console.log("Selected:", option);
    }
  }
};

// Results As List - Displays results in list format
export const ResultsAsList: Story = {
  args: {
    placeholder: "Search items...",
    options: mockOptions,
    displayResults: "list",
    onSelect: option => {
      console.log("Selected:", option);
    }
  }
};

// Custom Results Rendering
export const CustomResultsRendering: Story = {
  args: {
    placeholder: "Search with custom rendering...",
    options: mockOptions,
    displayResults: "custom",
    renderResults: ({ items, highlightedIndex, query, onSelect }) => (
      <div className="shadow-md rounded-lg border border-neutral-300 bg-white p-2">
        <p className="text-gray-500 mb-2 text-xs">
          Found {items.length} results for &quot;{query}&quot;
        </p>
        {items.map((item, index) => (
          <div
            key={item.id || item.label}
            onClick={() => onSelect(item.id || item.label)}
            className={`mb-1 cursor-pointer rounded p-2 hover:bg-primary-200 ${
              index === highlightedIndex ? "bg-gray-100" : "bg-transparent"
            }`}
          >
            <strong>{item.label}</strong>
            {item.caption && <span className="text-gray-400 ml-2">({item.caption})</span>}
          </div>
        ))}
      </div>
    ),
    onSelect: option => {
      console.log("Selected:", option);
    }
  }
};

// Loading State - Shows loading indicator
export const LoadingState: Story = {
  args: {
    placeholder: "Search items...",
    options: mockOptions,
    isLoading: true
  }
};

// Small Size - Compact version
export const SmallSize: Story = {
  args: {
    placeholder: "Search items...",
    options: mockOptions,
    size: "small",
    displayResults: "text",
    onSelect: option => {
      console.log("Selected:", option);
    }
  }
};

// Disabled - Non-interactive state
export const Disabled: Story = {
  args: {
    placeholder: "Search disabled...",
    options: mockOptions,
    disabled: true
  }
};

// Max Height Results - Limited results height
export const MaxHeightResults: Story = {
  args: {
    placeholder: "Search with limited height...",
    options: [
      ...mockOptions,
      { id: "7", label: "Spinach", caption: "Vegetable" },
      { id: "8", label: "Lettuce", caption: "Vegetable" },
      { id: "9", label: "Cucumber", caption: "Vegetable" },
      { id: "10", label: "Pepper", caption: "Vegetable" }
    ],
    displayResults: "list",
    resultsMaxHeight: "150px",
    onSelect: option => {
      console.log("Selected:", option);
    }
  }
};

// No Display Results - Input only, no dropdown
export const NoDisplayResults: Story = {
  args: {
    placeholder: "Type to search (no results shown)...",
    options: mockOptions,
    displayResults: "none",
    onQueryChange: query => {
      console.log("Query changed:", query);
    }
  }
};
