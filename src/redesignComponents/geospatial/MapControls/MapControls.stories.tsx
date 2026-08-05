import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

import {
  CheckIndeterminateIcon,
  DocumentIcon,
  DownloadIcon,
  FilterIcon,
  PlaceholderIcon,
  PlusIcon,
  SendIcon
} from "@/redesignComponents/foundations/Icons";

import MapControls from "./MapControls";

const meta = {
  title: "Redesign Components/Geospatial/Map Controls",
  component: MapControls,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: "Horizontal or vertical toolbar container for grouping action buttons."
      }
    }
  },
  tags: ["autodocs"],
  argTypes: {
    items: { description: "List of toolbar button items", control: false },
    vertical: { description: "Stack buttons vertically", control: "boolean" },
    expanded: {
      description: "Whether the toolbar is expanded to show labels",
      control: "boolean"
    },
    showExpandedToggle: {
      description: "Show the expand/collapse toggle button",
      control: "boolean"
    },
    ariaLabel: {
      description: "Accessible label for the toolbar",
      control: "text"
    },
    defaultGaps: {
      description: "Space items into separate groups (CSS gap). Set item.gap to false to keep items united.",
      control: "boolean"
    },
    autoCollapse: {
      description:
        "Fill the parent and hide overflowing items in a ⋯ menu when space is insufficient. Can be combined with `showExpandedToggle`.",
      control: "boolean"
    },
    expandSide: {
      description:
        "Direction labels open toward when expanding. Vertical keeps the icon column fixed; horizontal widens from the opposite edge.",
      control: "radio",
      options: ["left", "right"]
    },
    labels: {
      description: "Override internal UI labels for i18n",
      control: false
    }
  }
} satisfies Meta<typeof MapControls>;

export default meta;
type Story = StoryObj<typeof meta>;

const expandItems = [
  {
    icon: <PlusIcon />,
    ariaLabel: "Zoom in",
    label: "Zoom in",
    tooltip: "Zoom in"
  },
  {
    icon: <CheckIndeterminateIcon />,
    ariaLabel: "Zoom out",
    label: "Zoom out",
    tooltip: "Zoom out",
    gap: true
  },
  {
    icon: <DownloadIcon />,
    ariaLabel: "Save",
    label: "Save",
    tooltip: "Save",
    gap: true
  },
  {
    icon: <SendIcon />,
    ariaLabel: "Share",
    label: "Share",
    tooltip: "Share",
    gap: true
  },
  {
    icon: <FilterIcon />,
    ariaLabel: "Map settings",
    label: "Map settings",
    tooltip: "Map settings"
  }
];

const frameStyle = {
  position: "relative" as const,
  width: 480,
  height: 384,
  border: "0.0625rem dashed #ccc",
  background:
    "repeating-linear-gradient(0deg, transparent, transparent 15px, #f5f5f5 15px, #f5f5f5 16px), repeating-linear-gradient(90deg, transparent, transparent 15px, #f5f5f5 15px, #f5f5f5 16px)"
};

export const Default: Story = {
  args: {
    vertical: true,
    expanded: false,
    showExpandedToggle: true,
    defaultGaps: true,
    expandSide: "right",
    items: [
      {
        icon: <PlusIcon />,
        ariaLabel: "Zoom in",
        label: "Zoom in",
        gap: false
      },
      {
        icon: <CheckIndeterminateIcon />,
        ariaLabel: "Zoom out",
        label: "Zoom out"
      },
      {
        icon: <DocumentIcon />,
        ariaLabel: "Print",
        label: "Print"
      }
    ]
  }
};

export const WithTooltip: Story = {
  args: {
    vertical: true,
    expanded: false,
    showExpandedToggle: true,
    defaultGaps: true,
    items: [
      {
        icon: <SendIcon />,
        ariaLabel: "Share",
        disabled: false,
        label: "Share",
        tooltip: "Share tooltip"
      },
      {
        icon: <DocumentIcon />,
        ariaLabel: "Print",
        label: "Print",
        tooltip: "Print tooltip"
      }
    ]
  }
};

const ActiveItemExample = () => {
  const [activeItem, setActiveItem] = React.useState(true);

  const items = React.useMemo(
    () => [
      ...expandItems.slice(0, 2),
      {
        icon: <PlaceholderIcon />,
        ariaLabel: "Toggle polygons",
        label: "Polygons",
        tooltip: "Active or inactive item",
        gap: true,
        active: activeItem,
        onClick: () => setActiveItem(prev => !prev)
      },
      ...expandItems.slice(2)
    ],
    [activeItem]
  );

  return (
    <div style={{ height: "500px", width: "700px" }}>
      <div style={{ position: "absolute", top: 16, left: 16 }}>
        <MapControls
          vertical
          expanded
          showExpandedToggle
          defaultGaps={false}
          expandSide="right"
          ariaLabel="Active item example"
          items={items}
        />
      </div>
      <p
        style={{
          position: "absolute",
          bottom: 16,
          left: 16,
          margin: 0,
          fontSize: 14
        }}
      >
        Active Item: <strong>{activeItem ? "on" : "off"}</strong>
      </p>
    </div>
  );
};

export const ActiveItem: Story = {
  args: {
    items: expandItems
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          "Optional `item.active` tints the icon and label `primary.700` and sets `aria-pressed`. Use it for toggles such as map layer visibility — the consumer owns the state and passes `active` back in."
      }
    }
  },
  render: () => <ActiveItemExample />
};

export const ExpandVerticalRight: Story = {
  args: {
    vertical: true,
    expanded: false,
    showExpandedToggle: true,
    defaultGaps: false,
    expandSide: "right",
    ariaLabel: "Vertical toolbar expanding right",
    items: expandItems
  },
  render: args => (
    <div style={frameStyle}>
      <div style={{ position: "absolute", top: 16, left: 16 }}>
        <MapControls {...args} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Vertical toolbar with `expandSide="right"`. Icons stay fixed; labels grow to the right.'
      }
    }
  }
};

export const ExpandVerticalLeft: Story = {
  args: {
    vertical: true,
    expanded: false,
    showExpandedToggle: true,
    defaultGaps: false,
    expandSide: "left",
    ariaLabel: "Vertical toolbar expanding left",
    items: expandItems
  },
  render: args => (
    <div style={frameStyle}>
      <div style={{ position: "absolute", top: 16, right: 16 }}>
        <MapControls {...args} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Vertical toolbar with `expandSide="left"`. Icons stay fixed; labels grow to the left.'
      }
    }
  }
};

export const ExpandHorizontalRight: Story = {
  args: {
    vertical: false,
    expanded: false,
    showExpandedToggle: true,
    defaultGaps: false,
    expandSide: "right",
    ariaLabel: "Horizontal toolbar expanding right",
    items: expandItems
  },
  render: args => (
    <div style={{ height: "100px", width: "700px" }}>
      <div style={{ position: "absolute", bottom: 16, right: 16 }}>
        <MapControls {...args} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Horizontal toolbar with `expandSide="right"`. Buttons widen in flow from the anchored left edge.'
      }
    }
  }
};

export const ExpandHorizontalLeft: Story = {
  args: {
    vertical: false,
    expanded: false,
    showExpandedToggle: true,
    defaultGaps: false,
    expandSide: "left",
    ariaLabel: "Horizontal toolbar expanding left",
    items: expandItems
  },
  render: args => (
    <div style={{ height: "100px", width: "700px" }}>
      <div style={{ position: "absolute", bottom: 16, left: 16 }}>
        <MapControls {...args} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Horizontal toolbar with `expandSide="left"`. Buttons widen in flow from the anchored right edge.'
      }
    }
  }
};

const autoCollapseItems = [
  ...expandItems,
  {
    icon: <DocumentIcon />,
    ariaLabel: "Print",
    label: "Print",
    tooltip: "Print",
    gap: true
  }
];

const AutoCollapseFrame = ({
  children,
  initialWidth = 420,
  initialHeight = 280,
  minWidth = 160,
  maxWidth = 900,
  minHeight = 120,
  maxHeight = 520,
  resize = "width"
}: {
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  resize?: "width" | "height" | "both";
}) => {
  const [width, setWidth] = React.useState(initialWidth);
  const [height, setHeight] = React.useState(initialHeight);
  const showWidth = resize === "width" || resize === "both";
  const showHeight = resize === "height" || resize === "both";
  const widthInputId = React.useId();
  const heightInputId = React.useId();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {showWidth && (
        <label
          htmlFor={widthInputId}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 14,
            maxWidth: 420
          }}
        >
          <span>
            Container width: <strong>{width}px</strong> — drag to test overflow
          </span>
          <input
            id={widthInputId}
            type="range"
            min={minWidth}
            max={maxWidth}
            value={width}
            onChange={event => setWidth(Number(event.target.value))}
          />
        </label>
      )}
      {showHeight && (
        <label
          htmlFor={heightInputId}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 14,
            maxWidth: 420
          }}
        >
          <span>
            Container height: <strong>{height}px</strong> — drag to test overflow
          </span>
          <input
            id={heightInputId}
            type="range"
            min={minHeight}
            max={maxHeight}
            value={height}
            onChange={event => setHeight(Number(event.target.value))}
          />
        </label>
      )}
      <div
        style={{
          width: showWidth ? width : initialWidth,
          height: showHeight ? height : undefined,
          minHeight: showHeight ? undefined : 96,
          padding: 16,
          border: "0.0625rem dashed #ccc",
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 15px, #f5f5f5 15px, #f5f5f5 16px), repeating-linear-gradient(90deg, transparent, transparent 15px, #f5f5f5 15px, #f5f5f5 16px)",
          boxSizing: "border-box",
          overflow: "hidden"
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const AutoCollapseHorizontal: Story = {
  args: {
    vertical: false,
    expanded: false,
    autoCollapse: true,
    showExpandedToggle: false,
    defaultGaps: false,
    expandSide: "right",
    ariaLabel: "Auto-collapsing horizontal toolbar",
    items: autoCollapseItems
  },
  render: args => (
    <AutoCollapseFrame initialWidth={360}>
      <MapControls {...args} />
    </AutoCollapseFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "With `autoCollapse`, shrink the container to hide items behind the overflow menu. Widen it to reveal them again."
      }
    }
  }
};

export const AutoCollapseWithExpandToggle: Story = {
  args: {
    vertical: false,
    expanded: false,
    autoCollapse: true,
    showExpandedToggle: true,
    defaultGaps: false,
    expandSide: "right",
    ariaLabel: "Auto-collapsing toolbar with expand toggle",
    items: autoCollapseItems
  },
  render: args => (
    <AutoCollapseFrame initialWidth={420} minWidth={160} maxWidth={900}>
      <MapControls {...args} />
    </AutoCollapseFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "`autoCollapse` + `showExpandedToggle`: overflow items move into the ⋯ menu as the container shrinks, while the expand/collapse control remains available to show labels on visible items. Space for the toggle is reserved in the overflow math."
      }
    }
  }
};

export const AutoCollapseVerticalWithExpandToggle: Story = {
  args: {
    vertical: true,
    expanded: false,
    autoCollapse: true,
    showExpandedToggle: true,
    defaultGaps: false,
    expandSide: "right",
    ariaLabel: "Auto-collapsing vertical toolbar with expand toggle",
    items: autoCollapseItems
  },
  render: args => (
    <AutoCollapseFrame resize="height" initialWidth={200} initialHeight={280} minHeight={100} maxHeight={520}>
      <MapControls {...args} />
    </AutoCollapseFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Vertical `autoCollapse` + `showExpandedToggle`: shrink the container height to move items into the ⋯ menu. The expand/collapse control stays available so labels can show on the items that remain visible."
      }
    }
  }
};

export const AutoCollapseVertical: Story = {
  args: {
    vertical: true,
    expanded: false,
    autoCollapse: true,
    showExpandedToggle: false,
    defaultGaps: false,
    expandSide: "right",
    ariaLabel: "Auto-collapsing vertical toolbar",
    items: autoCollapseItems
  },
  render: args => (
    <AutoCollapseFrame resize="height" initialWidth={96} initialHeight={220} minHeight={100} maxHeight={480}>
      <MapControls {...args} />
    </AutoCollapseFrame>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Vertical `autoCollapse`: shrink the container height to hide items behind the overflow menu. The menu opens to the right of the ⋯ trigger."
      }
    }
  }
};

export const AutoCollapseVerticalLeft: Story = {
  args: {
    vertical: true,
    expanded: false,
    autoCollapse: true,
    showExpandedToggle: false,
    defaultGaps: false,
    expandSide: "left",
    ariaLabel: "Vertical toolbar overflow opening left",
    items: autoCollapseItems
  },
  render: args => (
    <AutoCollapseFrame resize="height" initialWidth={96} initialHeight={200} minHeight={100} maxHeight={480}>
      <div style={{ display: "flex", justifyContent: "flex-end", height: "100%" }}>
        <MapControls {...args} />
      </div>
    </AutoCollapseFrame>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Vertical `autoCollapse` with `expandSide="left"`. Overflow menu opens to the left of the ⋯ trigger.'
      }
    }
  }
};

export const Single: Story = {
  args: {
    items: [
      {
        icon: <DocumentIcon />,
        label: "Print",
        ariaLabel: "print"
      }
    ],
    showExpandedToggle: false,
    expanded: true
  }
};

export const Disabled: Story = {
  args: {
    items: [
      {
        icon: <SendIcon />,
        ariaLabel: "share",
        disabled: true
      }
    ]
  }
};
