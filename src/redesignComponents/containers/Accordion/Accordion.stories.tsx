import { Meta, StoryObj } from "@storybook/react";

import Accordion from "./Accordion";
import AccordionHeader from "./AccordionHeader";

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
    children: "This is the accordion content. You can put any content here."
  }
};

export const WithHeaderError: Story = {
  args: {
    header: (
      <AccordionHeader
        label="Label"
        title="Header Title"
        badge="Label"
        status="error"
        buttonProps={{
          onClick: () => console.log("Edit clicked"),
          label: "Edit"
        }}
      />
    ),
    children: "This is the accordion content. You can put any content here."
  }
};

export const WithHeaderSuccess: Story = {
  args: {
    header: (
      <AccordionHeader
        label="Label"
        title="Header Title"
        badge="Label"
        status="success"
        buttonProps={{
          onClick: () => console.log("Edit clicked"),
          label: "Edit"
        }}
      />
    ),
    children: "This is the accordion content. You can put any content here."
  }
};

export const WithHeaderNoBadge: Story = {
  args: {
    header: (
      <AccordionHeader
        label="Label"
        title="Header Title"
        status="success"
        buttonProps={{
          onClick: () => console.log("Edit clicked"),
          label: "Edit"
        }}
      />
    ),
    children: "This is the accordion content. You can put any content here."
  }
};

export const WithHeaderNoButton: Story = {
  args: {
    header: <AccordionHeader label="Label" title="Header Title" badge="Label" status="error" />,
    children: "This is the accordion content. You can put any content here."
  }
};

export const LongContent: Story = {
  args: {
    header: (
      <AccordionHeader
        label="Label"
        title="Header Title with Long Content"
        badge="Label"
        status="success"
        buttonProps={{
          onClick: () => console.log("Edit clicked"),
          label: "Edit"
        }}
      />
    ),
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
