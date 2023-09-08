import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import WizardForm, { WizardFormProps } from "@/components/extensive/WizardForm";
import { FormRead } from "@/generated/apiSchemas";
import { getCustomFormSteps } from "@/helpers/customForms";

import formSchema from "./formSchema.json";

const meta: Meta<typeof WizardForm> = {
  title: "Components/Extensive/Form/Wizard",
  component: WizardForm
};

export default meta;
type Story = StoryObj<typeof WizardForm>;

const client = new QueryClient();

export const WithGetFormStepHook: Story = {
  render: (args: WizardFormProps) => (
    <QueryClientProvider client={client}>
      <div className="flex w-full justify-center bg-background px-3">
        <WizardForm {...args} />
      </div>
    </QueryClientProvider>
  ),
  args: {
    steps: getCustomFormSteps(formSchema as FormRead, (t: any) => t),
    onStepChange: console.log,
    onChange: console.log,
    nextButtonText: "Save and Continue",
    submitButtonText: "Submit",
    hideBackButton: false,

    tabOptions: {
      vertical: false,
      disableFutureTabs: true,
      markDone: true
    }
  }
};
