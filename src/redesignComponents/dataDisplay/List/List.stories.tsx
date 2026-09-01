import { Flex, Text } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ActionStatusTag from "@/redesignComponents/actions/Tags/ActionStatusTag/ActionStatusTag";
import Avatar from "@/redesignComponents/navigation/Avatar/Avatar";

import { MessagesIcon, PlaceholderIcon, TreeCircleIcon, UserIcon } from "../../foundations/Icons";
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
        "Array of ListItemProps from WRI Design Systems — each item supports: label, caption, icon, value, variant, disabled, isExpanded, isHighlighted, onItemClick, ariaLabel"
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
        value: (
          <Text textStyle={"400-bold"} color="neutral.900">
            XXX,XXX
          </Text>
        )
      },
      {
        id: "2",
        label: "Label",
        variant: "data",
        ariaLabel: "Item 2",
        icon: <TreeCircleIcon className="h-6 w-6" />,
        onItemClick: () => console.log("Clicked item 2"),
        value: (
          <ActionStatusTag
            state="neutral-dark"
            icon={<PlaceholderIcon color="neutral.600" boxSize={3} />}
            label="Label"
          />
        )
      },
      {
        id: "3",
        label: "Label",
        variant: "data",
        ariaLabel: "Item 3",
        icon: <TreeCircleIcon className="h-6 w-6" />,
        onItemClick: () => console.log("Clicked item 3"),
        value: (
          <Flex alignItems="center" gap={1} textStyle="300" color="neutral.900">
            <PlaceholderIcon boxSize={4} color="neutral.800" /> + <PlaceholderIcon boxSize={4} color="neutral.800" /> +{" "}
            <PlaceholderIcon boxSize={4} color="neutral.800" />
          </Flex>
        )
      }
    ]
  }
};

export const ProfileListItems: Story = {
  args: {
    items: [
      {
        id: "1",
        label: "Label",
        icon: <Avatar name="Label" src="https://i.pravatar.cc/300?img=1" ariaLabel="Label" size="small" />,
        value: (
          <Button variant="borderless" size="small" leftIcon={<MessagesIcon boxSize={4} color="neutral.800" />}>
            Label
          </Button>
        )
      },
      {
        id: "2",
        label: "Label",
        icon: <Avatar name="Label" ariaLabel="Label" size="small" />,
        value: (
          <Button variant="borderless" size="small" leftIcon={<MessagesIcon boxSize={4} color="neutral.800" />}>
            Label
          </Button>
        )
      },
      {
        id: "3",
        label: "Label",
        icon: <Avatar name="Label" ariaLabel="Label" size="small" />,
        value: (
          <Button variant="borderless" size="small" leftIcon={<MessagesIcon boxSize={4} color="neutral.800" />}>
            Label
          </Button>
        )
      }
    ]
  }
};

export const LinkListItems: Story = {
  args: {
    itemsAlignItems: false,
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
