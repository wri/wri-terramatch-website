import { Flex } from "@chakra-ui/react";
import { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import TagSubmission from "@/redesignComponents/actions/Tags/TagSubmission/TagSubmission";
import { EditIcon, FolderIcon, FolderOpenIcon } from "@/redesignComponents/foundations/Icons";
import TextBadge from "@/redesignComponents/status/Badge/TextBadge";

import Accordion from "./Accordion";
import AccordionHeader from "./AccordionHeader";
import ListSectionHeader from "./ListSectionHeader";

const meta: Meta<typeof Accordion> = {
  title: "Redesign Components/Containers/Accordion",
  component: Accordion,
  parameters: {
    docs: {
      description: {
        component: "Accordion component built on top of ExtendableCard from WRI Design Systems."
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Default: Story = {
  args: {
    header: "Header Title",
    children: "This is the accordion content. You can put any content here.",
    className: "p-4"
  }
};

const actionsSuccess = (
  <Button
    variant="secondary"
    size="small"
    leftIcon={<EditIcon boxSize={4} />}
    onClick={() => console.log("Edit clicked")}
  >
    Edit
  </Button>
);

const actionsError = (
  <Button
    variant="secondary"
    size="small"
    leftIcon={<EditIcon boxSize={4} />}
    onClick={() => console.log("Edit clicked")}
  >
    Edit
  </Button>
);

export const WithHeaderError: Story = {
  args: {
    header: <AccordionHeader label="Label" title="Header Title" badge="Label" status="error" />,
    actions: actionsError,
    children: "This is the accordion content. You can put any content here."
  }
};

export const WithHeaderSuccess: Story = {
  args: {
    header: <AccordionHeader label="Label" title="Header Title" status="success" />,
    actions: actionsSuccess,
    children: "This is the accordion content. You can put any content here."
  }
};

export const WithHeaderNoButton: Story = {
  args: {
    header: <AccordionHeader label="Label" title="Header Title" status="success" />,
    children: "This is the accordion content. You can put any content here."
  }
};

export const LongContent: Story = {
  args: {
    header: <AccordionHeader label="Label" title="Header Title with Long Content" status="success" />,
    children: (
      <div>
        <p>This is a longer content example.</p>
        <p>You can include multiple paragraphs, lists, or any other React components.</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
    )
  }
};

export const variantSecondary: Story = {
  args: {
    header: <AccordionHeader label="Label" title="Header Title" />,
    children: "This is the accordion content. You can put any content here.",
    variant: "secondary"
  }
};

export const variantTertiary: Story = {
  args: {
    header: <AccordionHeader label="Label" title="Header Title" />,
    children: "This is the accordion content. You can put any content here.",
    variant: "tertiary"
  }
};

export const StatusLabel: Story = {
  args: {
    header: <AccordionHeader label="Label" title="Header Title" status="error" statusLabel="Status Label" />,
    children: "This is the accordion content. You can put any content here.",
    variant: "secondary"
  }
};

export const ListSectionHeaderTopLevel: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <Accordion
        variant="tertiary"
        open={open}
        onOpenChange={setOpen}
        header={
          <ListSectionHeader
            level="top-level"
            title="Header Title"
            caption="caption"
            icon={
              open ? <FolderOpenIcon boxSize={5} color="primary.600" /> : <FolderIcon boxSize={5} color="neutral.400" />
            }
            statusLabels={<TextBadge>Label</TextBadge>}
          />
        }
      >
        This is the accordion content. You can put any content here.
      </Accordion>
    );
  }
};

export const ListSectionHeaderSubLevel: Story = {
  render: () => {
    const [open, setOpen] = useState(true);

    return (
      <Accordion
        variant="quaternary"
        open={open}
        onOpenChange={setOpen}
        header={
          <ListSectionHeader
            level="sub-level"
            label="Label"
            title="Header Title"
            dueDate="dd/mm/yyyy"
            statusLabels={
              <Flex alignItems="center" gap={2}>
                <TagSubmission state="due" size="small" labelPrefix="X" />
                <TagSubmission state="draft" size="small" labelPrefix="X" />
                <TagSubmission state="information-required" size="small" labelPrefix="X" />
              </Flex>
            }
          />
        }
      >
        Nested content goes here.
      </Accordion>
    );
  }
};
