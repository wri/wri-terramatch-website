import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { getDisturbanceTableQuestions } from "@/components/elements/Inputs/DataTable/RHFDisturbanceTable";
import { FormFieldFactories } from "@/components/extensive/WizardForm/fields";
import Log from "@/utils/log";

import Component, { FormModalProps as Props } from "./FormModal";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Modal/FormModal",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;
const client = new QueryClient();

// Reference early to avoid circular dependency
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const FIELD_FACTORIES = FormFieldFactories;

export const Default: Story = {
  render: (args: Props) => (
    <QueryClientProvider client={client}>
      <div className="flex items-center justify-center bg-primary-400 p-8">
        <Component {...args} />
      </div>
    </QueryClientProvider>
  ),
  args: {
    title: "Add new disturbance",
    fields: getDisturbanceTableQuestions({ hasIntensity: true, hasExtent: true }),
    onSubmit: Log.info
  }
};
