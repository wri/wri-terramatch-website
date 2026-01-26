import { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "@worldresources/wri-design-systems";

const meta: Meta<typeof Textarea> = {
  title: "Redesign Components/Forms/Input/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    required: {
      control: "boolean",
      description: "Whether the textarea is required"
    },
    size: {
      control: "select",
      options: ["small", "default"],
      description: "Size of the textarea"
    },
    disabled: {
      control: "boolean",
      description: "Whether the textarea is disabled"
    },
    defaultValue: {
      control: "text",
      description: "Default value for the textarea"
    }
  }
};

export default meta;
type Story = StoryObj<typeof Textarea>;

// Required Textarea
export const RequiredTextarea: Story = {
  args: {
    label: "Description",
    placeholder: "Enter a description",
    required: true,
    name: "description"
  }
};

// Optional Textarea
export const OptionalTextarea: Story = {
  args: {
    label: "Comments",
    placeholder: "Enter your comments (optional)",
    required: false,
    name: "comments"
  }
};

// Small Textarea
export const SmallTextarea: Story = {
  args: {
    label: "Notes",
    placeholder: "Enter notes",
    size: "small",
    name: "notes"
  }
};

// Default Value
export const DefaultValue: Story = {
  args: {
    label: "Message",
    placeholder: "Enter your message",
    defaultValue: "This is a default message that can be edited.",
    name: "message"
  }
};

// Error Message
export const ErrorMessage: Story = {
  args: {
    label: "Feedback",
    placeholder: "Enter your feedback",
    caption: "Please provide at least 10 characters",
    name: "feedback",
    errorMessage: "Please provide at least 10 characters"
  }
};

// Max Length
export const MaxLength: Story = {
  args: {
    label: "Description",
    placeholder: "Enter description (max 100 characters)",
    maxLength: 100,
    name: "description"
  }
};

// Min Length
export const MinLength: Story = {
  args: {
    label: "Feedback",
    placeholder: "Enter feedback (min 10 characters)",
    minLength: 10,
    name: "feedback"
  }
};

// Disabled
export const Disabled: Story = {
  args: {
    label: "Read Only Content",
    placeholder: "This is disabled",
    disabled: true,
    defaultValue: "This textarea is disabled and cannot be edited.",
    name: "readOnly"
  }
};

// All Variants Showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "400px" }}>
      <Textarea label="Required Textarea" placeholder="This field is required" required name="required" />
      <Textarea label="Optional Textarea" placeholder="This field is optional" name="optional" />
      <Textarea label="Small Textarea" placeholder="Small size textarea" size="small" name="small" />
      <Textarea
        label="Textarea with Default Value"
        placeholder="Has default value"
        defaultValue="This is a default value that can be edited by the user."
        name="default"
      />
      <Textarea
        label="Textarea with Error"
        placeholder="This has an error"
        caption="This field has an error message"
        name="error"
      />
      <Textarea label="Textarea with Max Length" placeholder="Max 100 characters" maxLength={100} name="maxLength" />
      <Textarea label="Textarea with Min Length" placeholder="Min 10 characters" minLength={10} name="minLength" />
      <Textarea
        label="Disabled Textarea"
        placeholder="This is disabled"
        disabled
        defaultValue="This textarea is disabled and cannot be edited."
        name="disabled"
      />
    </div>
  )
};
