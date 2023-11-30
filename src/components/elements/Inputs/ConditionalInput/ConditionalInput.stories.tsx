import { Meta, StoryObj } from "@storybook/react";
import { useForm } from "react-hook-form";

import { apiQuestionsToFormFields } from "@/helpers/customForms";

import Component from "./ConditionalInput";

const meta: Meta<typeof Component> = {
  title: "Components/Elements/Inputs/ConditionalInput",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

export const Default: Story = {
  render: args => {
    const formHook = useForm();
    return <Component {...args} control={formHook.control} formHook={formHook} />;
  },
  args: {
    name: "conditional-field",
    label: "Input Label",
    description: "Input description",
    fields: apiQuestionsToFormFields(
      [
        {
          uuid: "22e0bc5c-b1ac-4be9-9ffa-f093eda823ea",
          input_type: "text",
          label: "title (yes)",
          validation: {
            required: false
          },
          multichoice: false,
          collection: "0",
          order: 0,
          options_list: "0",
          options_other: false,
          parent_id: "4a71d702-28a9-4332-b919-906b99b3189f",
          show_on_parent_condition: true,
          linked_field_key: "pro-rep-title"
        },
        {
          uuid: "1b1ae816-0bdd-41f5-9f9b-8b7a26abc21c",
          input_type: "number",
          label: "indeig 1 (yes)",
          validation: {
            required: false
          },
          multichoice: false,
          collection: "0",
          order: 1,
          options_list: "0",
          options_other: false,
          parent_id: "4a71d702-28a9-4332-b919-906b99b3189f",
          show_on_parent_condition: true,
          linked_field_key: "pro-rep-ind-1"
        },
        {
          uuid: "1cae7b53-21ed-440d-a702-691fb41c846b",
          input_type: "number",
          label: "indig 4 (No)",
          validation: {
            required: false
          },
          multichoice: false,
          collection: "0",
          order: 2,
          options_list: "0",
          options_other: false,
          parent_id: "4a71d702-28a9-4332-b919-906b99b3189f",
          show_on_parent_condition: false,
          linked_field_key: "pro-rep-ind-4"
        },
        {
          uuid: "bf72a391-7dd9-4dc9-82fa-e06ab0c2bfae",
          input_type: "number",
          label: "other 2 (No)",
          validation: {
            required: false
          },
          multichoice: false,
          collection: "0",
          order: 3,
          options_list: "0",
          options_other: false,
          parent_id: "4a71d702-28a9-4332-b919-906b99b3189f",
          show_on_parent_condition: false,
          linked_field_key: "pro-rep-chal-faced"
        }
      ],
      (t: any) => t
    )
  }
};
