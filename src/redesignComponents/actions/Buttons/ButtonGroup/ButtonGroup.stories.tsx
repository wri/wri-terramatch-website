import { Box } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";

import { PlusIcon } from "@/redesignComponents/foundations/Icons/PlusIcon";

import ButtonGroup from "./ButtonGroup";

const meta: Meta<typeof ButtonGroup> = {
  title: "Redesign Components/Actions/Buttons/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
  decorators: [
    Story => (
      <Box bg="neutral.200" p={4}>
        <Story />
      </Box>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const SingleButton: Story = {
  name: "Single button",
  args: {
    buttons: [
      {
        id: "btn-1",
        children: "Label",
        className: "!w-full"
      }
    ]
  }
};

export const SingleSmallButton: Story = {
  name: "Single small button",
  args: {
    buttons: [
      {
        id: "btn-1",
        children: "Label",
        className: "!w-full",
        size: "small"
      }
    ]
  }
};

export const RowThreeSecondaryEqualWidth: Story = {
  name: "Row: three secondary (equal width)",
  args: {
    buttons: [
      {
        id: "btn-1",
        children: "Label",
        variant: "secondary",
        className: "flex-1"
      },
      {
        id: "btn-2",
        children: "Label",
        variant: "secondary",
        className: "flex-1"
      },
      {
        id: "btn-3",
        children: "Label",
        variant: "secondary",
        className: "flex-1"
      }
    ]
  }
};

export const RowThreeSmallSecondaryEqualWidth: Story = {
  name: "Row: three small secondary (equal width)",
  args: {
    buttons: [
      {
        id: "btn-1",
        children: "Label",
        variant: "secondary",
        className: "flex-1",
        size: "small"
      },
      {
        id: "btn-2",
        children: "Label",
        variant: "secondary",
        className: "flex-1",
        size: "small"
      },
      {
        id: "btn-3",
        children: "Label",
        variant: "secondary",
        className: "flex-1",
        size: "small"
      }
    ]
  }
};

export const GroupedRowsSecondary: Story = {
  name: "Grouped rows: secondary pairs",
  args: {
    groups: [
      {
        id: "group-1",
        buttons: [
          {
            id: "btn-1",
            children: "Label",
            variant: "secondary",
            className: "flex-1"
          },
          {
            id: "btn-2",
            children: "Label",
            variant: "secondary",
            className: "flex-1"
          }
        ]
      },
      {
        id: "group-2",
        buttons: [
          {
            id: "btn-3",
            children: "Label",
            variant: "secondary",
            className: "flex-1"
          },
          {
            id: "btn-4",
            children: "Label",
            variant: "secondary",
            className: "flex-1"
          }
        ]
      }
    ]
  }
};

export const GroupedRowsSmallSecondary: Story = {
  name: "Grouped rows: small secondary pairs",
  args: {
    groups: [
      {
        id: "group-1",
        buttons: [
          {
            id: "btn-1",
            children: "Label",
            variant: "secondary",
            className: "flex-1",
            size: "small"
          },
          {
            id: "btn-2",
            children: "Label",
            variant: "secondary",
            className: "flex-1",
            size: "small"
          }
        ]
      },
      {
        id: "group-2",
        buttons: [
          {
            id: "btn-3",
            children: "Label",
            variant: "secondary",
            className: "flex-1",
            size: "small"
          },
          {
            id: "btn-4",
            children: "Label",
            variant: "secondary",
            className: "flex-1",
            size: "small"
          }
        ]
      }
    ]
  }
};

export const SingleButtonWithIcon: Story = {
  name: "Single button with icon",
  args: {
    buttons: [
      {
        id: "btn-1",
        children: "Label",
        className: "!w-full",
        leftIcon: <PlusIcon boxSize={4} />
      }
    ]
  }
};
