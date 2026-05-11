import { Box, Flex, Text } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";

import { PlaceholderIcon } from "@/redesignComponents/foundations/Icons/Function/PlaceholderIcon";

import Search from "./Search";

const mockOptions = [
  { id: "1", label: "Option 1", caption: "Caption 1" },
  { id: "2", label: "Option 2", caption: "Caption 2" },
  { id: "3", label: "Option 3", caption: "Caption 3" },
  { id: "4", label: "Option 4", caption: "Caption 4" },
  { id: "5", label: "Option 5", caption: "Caption 5" },
  { id: "6", label: "Option 6", caption: "Caption 6" }
];
const metaData = [
  { id: "1", city: "City", address: "Address 1" },
  { id: "2", city: "City", address: "Address 2" },
  { id: "3", city: "City", address: "Address 3" },
  { id: "4", city: "City", address: "Address 4" },
  { id: "5", city: "City", address: "Address 5" },
  { id: "6", city: "City", address: "Address 6" }
];

const meta: Meta<typeof Search> = {
  title: "Redesign Components/Actions/Search",
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

export const CustomResultsRenderingLocation: Story = {
  args: {
    placeholder: "Search with custom rendering...",
    options: mockOptions,
    displayResults: "custom",
    renderResults: ({ items, highlightedIndex, query, onSelect }) => (
      <Box shadow="md" rounded="0.375rem" border="0.0625rem solid" borderColor="neutral.300" bg="neutral.200">
        <Text textStyle="300" color="neutral.700" padding={3}>
          Showing {items.length} results
        </Text>
        {items.map((item, index) => (
          <Flex
            key={item.id || item.label}
            onClick={() => onSelect(item.id || item.label)}
            padding="3"
            gap="3"
            cursor="pointer"
            bg={index === highlightedIndex ? "neutral.400" : "transparent"}
            className="hover:bg-theme-neutral-300"
          >
            <PlaceholderIcon boxSize={6} color="primary.700" />
            <Flex direction="column" gap="1">
              <Text as="strong" textStyle="300-bold" color="neutral.900">
                {item.label}
              </Text>
              <Text as="span" textStyle="300" color="neutral.700">
                {metaData.find(meta => meta.id === item.id)?.city} •{" "}
                {metaData.find(meta => meta.id === item.id)?.address}
              </Text>
            </Flex>
          </Flex>
        ))}
      </Box>
    ),
    onSelect: option => {
      console.log("Selected:", option);
    }
  }
};

export const LoadingState: Story = {
  args: {
    placeholder: "Search items...",
    options: mockOptions,
    isLoading: true
  }
};

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

export const Disabled: Story = {
  args: {
    placeholder: "Search disabled...",
    options: mockOptions,
    disabled: true
  }
};

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
    resultsMaxHeight: "9.375rem",
    onSelect: option => {
      console.log("Selected:", option);
    }
  }
};

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
