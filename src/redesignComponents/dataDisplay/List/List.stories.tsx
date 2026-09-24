import { Flex } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import ProfileItem from "@/redesignComponents/content/ContentCard/ProfileListCard/ProfileItem";

import { TreeCircleIcon, UserIcon } from "../../foundations/Icons";
import List from "./List";

const meta: Meta<typeof List> = {
  title: "Redesign Components/Data Display/List",
  component: List,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    backgrounds: {
      default: "white",
      values: [
        { name: "white", value: "#FFFFFF" },
        { name: "gray", value: "#F5F5F5" }
      ]
    }
  },
  argTypes: {
    noBorder: {
      control: "boolean",
      description: "Removes the border wrapper from the list"
    },
    highlightedIndex: {
      control: "number",
      description: "Zero-based index of the item to highlight"
    },
    items: {
      description:
        "Array of ListItemProps — each item supports: label, caption, icon, value (string), variant, disabled, isExpanded, isHighlighted, onItemClick, ariaLabel"
    }
  }
};

export default meta;
type Story = StoryObj<typeof List>;

export const DataListItems: Story = {
  args: {
    items: [
      {
        id: "1",
        label: "Label",
        variant: "data",
        ariaLabel: "Item 1",
        icon: <TreeCircleIcon className="h-6 w-6" />,
        onItemClick: () => console.log("Clicked item 1"),
        value: "XXX,XXX"
      },
      {
        id: "2",
        label: "Label",
        variant: "data",
        ariaLabel: "Item 2",
        icon: <TreeCircleIcon className="h-6 w-6" />,
        onItemClick: () => console.log("Clicked item 2"),
        value: "XXX,XXX"
      },
      {
        id: "3",
        label: "Label",
        variant: "data",
        ariaLabel: "Item 3",
        icon: <TreeCircleIcon className="h-6 w-6" />,
        onItemClick: () => console.log("Clicked item 3"),
        value: "Draft"
      }
    ]
  }
};

export const ProfileListItems: Story = {
  args: {
    items: [
      { id: "1", label: "Label", caption: "Caption" },
      { id: "2", label: "Label", caption: "Caption" },
      { id: "3", label: "Label", caption: "Caption" }
    ]
  },
  render: args => {
    return (
      <Flex gap={4} flexDirection="column" padding={4}>
        {args.items.map((item, index) => (
          <ProfileItem
            key={item.id ?? index}
            profile={{
              id: item.id ?? String(index),
              name: item.label,
              image: index === 1 ? "https://i.pravatar.cc/300?img=1" : "",
              email: "name.surname@email.org",
              isProjectManager: index <= 1 ? true : false,
              messageText: "Label"
            }}
            onProfileClick={() => console.log("Clicked item 1")}
          />
        ))}
      </Flex>
    );
  }
};

export const LinkListItems: Story = {
  args: {
    items: [
      {
        id: "1",
        label: "Label",
        caption: "Data",
        variant: "navigation",
        icon: <UserIcon className="h-4.5 w-4.5" />
      },
      {
        id: "2",
        label: "Label",
        caption: "Data",
        variant: "navigation",
        icon: <UserIcon className="h-4.5 w-4.5" />
      },
      { id: "3", label: "Label", caption: "Data", variant: "navigation", icon: <UserIcon className="h-4.5 w-4.5" /> }
    ]
  }
};
