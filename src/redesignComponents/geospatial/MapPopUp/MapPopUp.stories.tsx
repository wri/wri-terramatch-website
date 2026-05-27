import { Flex, Text } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";
import { useRef, useState } from "react";

import { getThemedColor } from "@/lib/theme";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { NotificationIcon, PlaceholderIcon, TreeCircleIcon } from "@/redesignComponents/foundations/Icons";

import PointMarker from "../PointMarker/PointMarker";
import MapPopUp from "./MapPopUp";

const meta = {
  title: "Redesign Components/Geospatial/Map Pop Up",
  component: MapPopUp,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  decorators: [
    (Story: any) => (
      <div
        style={{
          height: "64.375rem",
          width: "50rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof MapPopUp>;

export default meta;
type Story = StoryObj<typeof meta>;

const footer = (
  <div>
    <Button size="small">Label</Button>
  </div>
);

export const Icon: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    anchorRef: null as any,
    header: (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: "0.25rem"
          }}
        >
          <NotificationIcon />
          <p
            style={{
              fontSize: "1rem",
              lineHeight: "1.5rem",
              fontWeight: "bold",
              marginBottom: "0.25rem",
              color: getThemedColor("neutral", 800)
            }}
          >
            Title
          </p>
        </div>
        <p
          style={{
            fontSize: "0.875rem",
            lineHeight: "1.25rem",
            color: getThemedColor("neutral", 700)
          }}
        >
          Caption
        </p>
      </div>
    ),
    content: (
      <div style={{ padding: "0.75rem" }}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit
        amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a,
        semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum
        diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim.
        Pellentesque congue.
      </div>
    ),
    footer
  },
  render: args => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    return (
      <div>
        <PointMarker
          ariaLabel="Icon marker"
          backgroundColor="#8ECA3FCC"
          icon={<PlaceholderIcon color="neutral.100" />}
          variant="icon"
          onClick={() => setOpen(true)}
          triggerRef={triggerRef}
          showFocusState={open}
        />
        <MapPopUp {...args} open={open} onOpenChange={setOpen} anchorRef={triggerRef} placement="right" />
      </div>
    );
  }
};

export const Circle: Story = {
  args: {
    open: false,
    onOpenChange: () => {},
    anchorRef: null as any,
    header: (
      <Text textStyle="400-bold" color="neutral-900">
        Title
      </Text>
    ),
    content: (
      <Flex justifyContent="space-between" alignItems="center" gap="0.25rem" padding="0.75rem">
        <Flex gap={2} alignItems="center">
          <TreeCircleIcon boxSize={6} />
          <Text textStyle="400" color="neutral-700">
            Label
          </Text>
        </Flex>
        <Text textStyle="400-bold" color="neutral-900">
          XXX,XXX
        </Text>
      </Flex>
    ),
    footer
  },
  render: args => {
    const [open, setOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);

    return (
      <div>
        <PointMarker
          ariaLabel="This is a custom icon marker"
          variant="simple-pin"
          onClick={() => setOpen(true)}
          triggerRef={triggerRef}
          showFocusState={open}
        />
        <MapPopUp {...args} open={open} onOpenChange={setOpen} anchorRef={triggerRef} placement="right" />
      </div>
    );
  }
};
