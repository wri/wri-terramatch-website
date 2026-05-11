import { Flex, Text } from "@chakra-ui/react";
import type { Meta, StoryObj } from "@storybook/react";
import { BrowserRouter, Link } from "react-router-dom";

import Button from "../../actions/Buttons/Button/Button";
import CloseButton from "../../actions/Buttons/CloseButton/CloseButton";
import IconButton from "../../actions/Buttons/IconButton/IconButton";
import { ChevronRightIcon, VisibilityOffIcon } from "../../foundations/Icons";
import Breadcrumb from "../../navigation/Breadcrumbs/Breadcrumb";
import TabBar from "../../navigation/TabBar/TabBar";
import Accordion from "../Accordion/Accordion";
import Panel from "./Panel";

const meta = {
  title: "Redesign Components/Containers/Panel/Panel",
  component: Panel,
  parameters: {
    layout: "centered"
  },
  tags: ["autodocs"],
  decorators: [
    Story => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    )
  ]
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: "25rem",
    content: (
      <Flex className="items-center justify-between gap-2 px-4 py-3">
        <Flex className="items-center gap-2">
          <IconButton
            icon={<ChevronRightIcon className="rotate-180" boxSize={4} color="neutral.800" />}
            onClick={() => {}}
          />
          <Text className="underline underline-offset-2" color="neutral.700">
            Back to surveys
          </Text>
        </Flex>
        <Flex className="items-center gap-2">
          <Text color="neutral.700">Close</Text>
          <CloseButton />
        </Flex>
      </Flex>
    )
  }
};

export const PanelWithBreadcrumb: Story = {
  args: {
    width: "25rem",
    content: (
      <Flex className="items-center justify-between gap-2 px-4 py-3">
        <Flex className="items-center gap-2">
          <IconButton
            icon={<ChevronRightIcon className="rotate-180" boxSize={4} color="neutral.800" />}
            onClick={() => {}}
          />
          <Breadcrumb
            size="small"
            maxItems={2}
            links={[
              { label: "Page level 1", link: "#" },
              { label: "...", link: "#" },
              { label: "Page level 3", link: "#" }
            ]}
            linkRouter={Link}
          />
        </Flex>
        <Flex className="items-center gap-2">
          <Text color="neutral.700">Close</Text>
          <CloseButton />
        </Flex>
      </Flex>
    )
  }
};

export const PanelTitle: Story = {
  args: {
    width: "25rem",
    content: (
      <Flex className="flex-col gap-2 p-4">
        <Flex className="w-full items-center justify-between gap-2">
          <Text textStyle="600-bold" color="neutral.800">
            Title
          </Text>
          <Flex className="items-center gap-2">
            <Text color="neutral.700">Close</Text>
            <CloseButton />
          </Flex>
        </Flex>
        <Text color="neutral.700">
          Lorem ipsum dolor sit amet consectetur. Ac lectus massa auctor ac purus aliquam enim nibh accumsan. Nunc neque
          suspendisse.
        </Text>
      </Flex>
    )
  }
};

export const PanelTitleHideCloseButton: Story = {
  args: {
    width: "25rem",
    content: (
      <Flex className="flex-col gap-2 p-4">
        <Flex className="w-full items-center justify-between gap-2">
          <Text textStyle="600-bold" color="neutral.800">
            Title
          </Text>
          <Button variant="secondary" size="small" leftIcon={<VisibilityOffIcon boxSize={4} />} onClick={() => {}}>
            Hide panel
          </Button>
        </Flex>
        <Text color="neutral.700">
          Lorem ipsum dolor sit amet consectetur. Ac lectus massa auctor ac purus aliquam enim nibh accumsan. Nunc neque
          suspendisse.
        </Text>
      </Flex>
    )
  }
};
export const PanelTitleAccordion: Story = {
  args: {
    width: "25rem",
    content: (
      <Flex className="flex-col gap-2">
        <Accordion
          header={
            <Text textStyle="600-bold" color="neutral.800">
              Title
            </Text>
          }
          variant="borderless"
        >
          <Text color="neutral.700" px={4} pb={4}>
            Lorem ipsum dolor sit amet consectetur. Ac lectus massa auctor ac purus aliquam enim nibh accumsan. Nunc
            neque suspendisse.
          </Text>
        </Accordion>
      </Flex>
    )
  }
};

export const StandardPanelHeader: Story = {
  args: {
    header: (
      <Flex className="flex-col gap-2 p-4">
        <Flex className="w-full items-center justify-between gap-2">
          <Text textStyle="600-bold" color="neutral.800">
            Title
          </Text>
          <Flex className="items-center gap-2">
            <Text color="neutral.700">Close</Text>
            <CloseButton />
          </Flex>
        </Flex>
        <Text color="neutral.700">
          Lorem ipsum dolor sit amet consectetur. Ac lectus massa auctor ac purus aliquam enim nibh accumsan. Nunc neque
          suspendisse.
        </Text>
      </Flex>
    ),
    content: (
      <TabBar
        tabs={[
          { label: "Label", value: "label-1-tab" },
          { label: "Label", value: "label-2-tab" },
          { label: "Label", value: "label-3-tab" }
        ]}
        variant="panel"
        onTabClick={() => {}}
      />
    )
  }
};

export const StandardPanelHeaderIcon: Story = {
  args: {
    header: (
      <Flex className="items-center justify-between gap-2 px-4 py-3">
        <Flex className="items-center gap-2">
          <IconButton
            icon={<ChevronRightIcon className="rotate-180" boxSize={4} color="neutral.800" />}
            onClick={() => {}}
          />
          <Text className="underline underline-offset-2" color="neutral.700">
            Back to surveys
          </Text>
        </Flex>
        <Flex className="items-center gap-2">
          <Text color="neutral.700">Close</Text>
          <CloseButton />
        </Flex>
      </Flex>
    ),
    content: (
      <Flex className="flex-col pt-4">
        <Flex className="border-theme-neutral-300 flex-col gap-2 border-b">
          <Flex className="w-full items-center justify-between gap-2 px-4">
            <Text textStyle="600-bold" color="neutral.800">
              Title
            </Text>
            <Flex className="items-center gap-2">
              <Text color="neutral.700">Close</Text>
              <CloseButton />
            </Flex>
          </Flex>
          <Text color="neutral.700" px={4} pb={4}>
            Lorem ipsum dolor sit amet consectetur. Ac lectus massa auctor ac purus aliquam enim nibh accumsan. Nunc
            neque suspendisse.
          </Text>
        </Flex>
        <TabBar
          tabs={[
            { label: "Label", value: "label-1-tab" },
            { label: "Label", value: "label-2-tab" },
            { label: "Label", value: "label-3-tab" }
          ]}
          variant="panel"
          onTabClick={() => {}}
        />
      </Flex>
    )
  }
};

export const PanelContent: Story = {
  args: {
    width: "fit-content",
    content: (
      <Flex className="flex-col p-4">
        <Flex className="border-theme-neutral-700 bg-theme-neutral-200 flex-col gap-2 rounded-lg border border-dashed p-4">
          <Text color="neutral.800" textStyle="700-bold" className="whitespace-nowrap">
            Component placeholder
          </Text>
          <Text color="neutral.700">Substitute for another component</Text>
        </Flex>
      </Flex>
    )
  }
};
