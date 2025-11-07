import { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";

import FormField from "@/components/extensive/WizardForm/FormField";
import WizardFormProvider, { LocalStep, useLocalStepsProvider } from "@/context/wizardForm.provider";

import Component from "./ConditionalInput";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/ConditionalInput",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const STEPS: LocalStep[] = [
  {
    id: "step",
    fields: [
      {
        inputType: "conditional",
        name: "conditional-field",
        label: "Input Label",
        children: [
          {
            name: "22e0bc5c-b1ac-4be9-9ffa-f093eda823ea",
            inputType: "text",
            label: "title (yes)",
            validation: {
              required: false
            },
            showOnParentCondition: true,
            linkedFieldKey: "pro-rep-title"
          },
          {
            name: "1b1ae816-0bdd-41f5-9f9b-8b7a26abc21c",
            inputType: "number",
            label: "indeig 1 (yes)",
            validation: {
              required: false
            },
            showOnParentCondition: true,
            linkedFieldKey: "pro-rep-ind-1"
          },
          {
            name: "1cae7b53-21ed-440d-a702-691fb41c846b",
            inputType: "number",
            label: "indig 4 (No)",
            validation: {
              required: false
            },
            showOnParentCondition: false,
            linkedFieldKey: "pro-rep-ind-4"
          },
          {
            name: "bf72a391-7dd9-4dc9-82fa-e06ab0c2bfae",
            inputType: "number",
            label: "other 2 (No)",
            validation: {
              required: false
            },
            showOnParentCondition: false,
            linkedFieldKey: "pro-rep-chal-faced"
          }
        ]
      }
    ]
  }
];

export const Default: Story = {
  render: args => {
    const formHook = useForm();
    const onChangeCapture = () => {};
    const provider = useLocalStepsProvider(STEPS);
    return (
      <WizardFormProvider fieldsProvider={provider}>
        <FormField fieldId={args.fieldId} formHook={formHook} onChange={onChangeCapture} />
      </WizardFormProvider>
    );
  },
  args: {
    fieldId: "conditional-field"
  }
};
