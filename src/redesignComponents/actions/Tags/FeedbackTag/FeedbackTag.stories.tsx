import { Meta, StoryObj } from "@storybook/react";

import { Info } from "@/redesignComponents/foundations/Icons";

import FeedbackTag from "./FeedbackTag";

const meta: Meta<typeof FeedbackTag> = {
  title: "Redesign Components/Actions/Tags/Feedback Tag",
  component: FeedbackTag,
  decorators: [
    Story => (
      <div className="flex items-center justify-center">
        <Story />
      </div>
    )
  ],
  args: {
    label: "Feedback",
    disabled: false,
    size: "default",
    icon: <Info />
  }
};

export default meta;
type Story = StoryObj<typeof FeedbackTag>;

export const InfoWhite: Story = {
  args: {
    type: "info-white",
    label: "Info White"
  }
};

export const InfoGrey: Story = {
  args: {
    type: "info-grey",
    label: "Info Grey"
  }
};

export const Success: Story = {
  args: {
    type: "success",
    label: "Success"
  }
};

export const Warning: Story = {
  args: {
    type: "warning",
    label: "Warning"
  }
};

export const Error: Story = {
  args: {
    type: "error",
    label: "Error"
  }
};

export const Disabled: Story = {
  args: {
    type: "success",
    label: "Disabled",
    disabled: true
  }
};

export const Closable: Story = {
  args: {
    type: "info-grey",
    label: "Closable",
    closable: true
  }
};

export const WithoutIcon: Story = {
  args: {
    type: "success",
    label: "No Icon",
    icon: undefined
  }
};

export const SizeVariations: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <FeedbackTag type="success" label="Small" size="small" icon={<Info />} />
        <FeedbackTag type="success" label="Default" size="default" icon={<Info />} />
        <FeedbackTag type="success" label="Large" size="large" icon={<Info />} />
      </div>
      <div className="flex items-center gap-4">
        <FeedbackTag type="warning" label="Small" size="small" icon={<Info />} />
        <FeedbackTag type="warning" label="Default" size="default" icon={<Info />} />
        <FeedbackTag type="warning" label="Large" size="large" icon={<Info />} />
      </div>
      <div className="flex items-center gap-4">
        <FeedbackTag type="error" label="Small" size="small" icon={<Info />} />
        <FeedbackTag type="error" label="Default" size="default" icon={<Info />} />
        <FeedbackTag type="error" label="Large" size="large" icon={<Info />} />
      </div>
    </div>
  )
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <FeedbackTag type="info-white" label="Info White" icon={<Info />} />
      <FeedbackTag type="info-grey" label="Info Grey" icon={<Info />} />
      <FeedbackTag type="success" label="Success" icon={<Info />} />
      <FeedbackTag type="warning" label="Warning" icon={<Info />} />
      <FeedbackTag type="error" label="Error" icon={<Info />} />
      <FeedbackTag type="success" label="Disabled" icon={<Info />} disabled />
      <FeedbackTag type="info-grey" label="Closable" icon={<Info />} closable />
    </div>
  )
};
