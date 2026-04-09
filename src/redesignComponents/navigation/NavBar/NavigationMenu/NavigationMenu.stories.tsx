import { Meta, StoryObj } from "@storybook/react";

import { PlaceholderIcon } from "@/redesignComponents/foundations/Icons";

import NavigationMenu, { NavigationMenuItem } from "./NavigationMenu";

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
  }
};

export const SimpleMenu: Story = {
  args: {
    variant: "simple",
    items: simpleItems
  }
};

export const ListMenu: Story = {
  args: {
    variant: "list",
    items: listItems,
    selectedIndex: 1
  }
};

export const VariantComparison: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "40px", alignItems: "flex-start", padding: "20px" }}>
      <div>
        <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", textAlign: "center" }}>Mega menu</p>
        <NavigationMenu variant="mega" items={megaItems} />
      </div>
      <div>
        <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", textAlign: "center" }}>Simple menu</p>
        <NavigationMenu variant="simple" items={simpleItems} />
      </div>
      <div>
        <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "16px", textAlign: "center" }}>List menu</p>
        <NavigationMenu variant="list" items={listItems} selectedIndex={1} />
      </div>
    </div>
  )
};
