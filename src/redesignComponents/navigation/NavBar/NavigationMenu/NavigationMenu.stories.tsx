import { Box } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";

import { PlaceholderIcon } from "@/redesignComponents/foundations/Icons";

import NavigationMenu, { NavigationMenuItem } from "./NavigationMenu";

const StoryMenuWrapper = ({ children }: { children: React.ReactNode }) => (
  <Box pt="0.625rem">
    <Box position="relative" display="inline-block">
      <Box
        position="absolute"
        top="-0.375rem"
        right="1.625rem"
        width="0.75rem"
        height="0.75rem"
        bg="white"
        borderTop="0.0625rem solid"
        borderLeft="0.0625rem solid"
        borderColor="neutral.300"
        transform="rotate(45deg)"
        zIndex={5}
        borderTopLeftRadius="0.125rem"
      />
      <Box position="relative" zIndex={2}>
        {children}
      </Box>
    </Box>
  </Box>
);

const meta: Meta<typeof NavigationMenu> = {
  title: "Redesign Components/Navigation/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered"
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["mega", "simple", "list"],
      description: "Visual variant of the navigation menu"
    },
    items: {
      description: "Array of menu items"
    },
    selectedIndex: {
      control: "number",
      description: "Currently selected index (used in list variant)"
    },
    onSelect: {
      action: "selected",
      description: "Callback fired when an item is selected, returns the index"
    }
  }
};

export default meta;
type Story = StoryObj<typeof NavigationMenu>;

const megaItems: NavigationMenuItem[] = [
  { label: "Label", caption: "Caption", icon: <PlaceholderIcon color="neutral.700" /> },
  { label: "Label", caption: "Caption", icon: <PlaceholderIcon color="neutral.700" /> },
  { label: "Label", caption: "Caption", icon: <PlaceholderIcon color="neutral.700" /> },
  { label: "Label", caption: "Caption", icon: <PlaceholderIcon color="neutral.700" /> },
  { label: "Label", caption: "Caption", icon: <PlaceholderIcon color="neutral.700" /> },
  { label: "Label", caption: "Caption", icon: <PlaceholderIcon color="neutral.700" /> }
];

const simpleItems: NavigationMenuItem[] = [
  { label: "Label" },
  { label: "Label" },
  { label: "Label" },
  { label: "Label" },
  { label: "Label" }
];

const listItems: NavigationMenuItem[] = [
  { label: "Label" },
  { label: "Label" },
  { label: "Label" },
  { label: "Label" }
];

export const MegaMenu: Story = {
  args: {
    variant: "mega",
    items: megaItems
  },
  decorators: [
    Story => (
      <StoryMenuWrapper>
        <Story />
      </StoryMenuWrapper>
    )
  ]
};

export const SimpleMenu: Story = {
  args: {
    variant: "simple",
    items: simpleItems
  },
  decorators: [
    Story => (
      <StoryMenuWrapper>
        <Story />
      </StoryMenuWrapper>
    )
  ]
};

export const ListMenu: Story = {
  args: {
    variant: "list",
    items: listItems,
    selectedIndex: 1
  },
  decorators: [
    Story => (
      <StoryMenuWrapper>
        <Story />
      </StoryMenuWrapper>
    )
  ]
};

export const VariantComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "2.5rem", alignItems: "flex-start", padding: "1.25rem" }}>
      <div>
        <p style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", textAlign: "center" }}>Mega menu</p>
        <StoryMenuWrapper>
          <NavigationMenu variant="mega" items={megaItems} />
        </StoryMenuWrapper>
      </div>
      <div>
        <p style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", textAlign: "center" }}>Simple menu</p>
        <StoryMenuWrapper>
          <NavigationMenu variant="simple" items={simpleItems} />
        </StoryMenuWrapper>
      </div>
      <div>
        <p style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "1rem", textAlign: "center" }}>List menu</p>
        <StoryMenuWrapper>
          <NavigationMenu variant="list" items={listItems} selectedIndex={1} />
        </StoryMenuWrapper>
      </div>
    </div>
  )
};
