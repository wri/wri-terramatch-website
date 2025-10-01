import "@/yup.locale";

import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createLocalStepsProvider } from "@/context/wizardForm.provider";
import { FileType } from "@/types/common";
import Log from "@/utils/log";

import Component, { WizardFormProps as Props } from ".";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Form/Wizard",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const client = new QueryClient();

const PROVIDER = createLocalStepsProvider([
  {
    id: "simpleInputs",
    title: "Simple Inputs",
    description: "These are all simple inputs",
    fields: [
      {
        name: "text_field",
        label: "Simple text field",
        placeholder: "Please enter ...",
        inputType: "text",
        validation: { required: true }
      },
      {
        name: "number_field",
        label: "Simple number field",
        placeholder: "Please enter ...",
        inputType: "number",
        validation: { required: true }
      }
    ]
  },
  {
    id: "dropdownInputs",
    title: "Dropdown Inputs",
    description: "These are all simple inputs",
    fields: [
      {
        name: "dropdown_input",
        label: "Dropdown component",
        placeholder: "Select ...",
        inputType: "select",
        validation: { required: true },
        optionsOther: true,
        options: [
          { title: "Option 1", value: "1" },
          { title: "Option 2", value: "2" },
          { title: "Option 3", value: "3" }
        ]
      },
      {
        name: "multi_dropdown_input",
        label: "Multi-Select Dropdown component",
        placeholder: "Select ...",
        inputType: "select",
        validation: { required: true },
        multiChoice: true,
        optionsOther: true,
        options: [
          { title: "Option 1", value: "1" },
          { title: "Option 2", value: "2" },
          { title: "Option 3", value: "3" },
          { title: "Option 4", value: "4" }
        ]
      },
      {
        name: "field_country",
        label: "Country selector",
        placeholder: "Select country ...",
        inputType: "select",
        validation: { required: true },
        options: [
          { title: "United States", value: "USA" },
          { title: "México", value: "MEX" },
          { title: "Colombia", value: "COL" }
        ]
      }
    ]
  },
  {
    id: "selectInputs",
    title: "Select Inputs",
    description: "These are all simple inputs",
    fields: [
      {
        name: "select_input",
        label: "Select component",
        placeholder: "Select ...",
        inputType: "radio",
        validation: { required: true },
        options: [
          { title: "Option 1", value: "1" },
          { title: "Option 2", value: "2" },
          { title: "Option 3", value: "3" }
        ]
      }
    ]
  },
  {
    id: "fileUploader",
    title: "File Uploader",
    description: "These are upload component, uploads won't work here since uuid/collection/model are invalid.",
    fields: [
      {
        name: "Single File Upload",
        inputType: "file",
        label: "Upload a file",
        placeholder: "Add File",
        collection: "collection",
        multiChoice: false,
        additionalProps: {
          max: 5,
          accept: [FileType.ImagePdf]
        },
        model: "projects"
      },
      {
        name: "Multiple File Upload",
        inputType: "file",
        label: "Upload multiple file",
        placeholder: "Add File",
        collection: "collection",
        multiChoice: true,
        additionalProps: {
          max: 5,
          accept: [FileType.ImagePdf]
        },
        model: "projects"
      }
    ]
  },
  {
    id: "treeSpeciesInput",
    title: "Tree species input",
    description: "This is tree species input component",
    fields: [
      {
        name: "tree_species",
        inputType: "treeSpecies",
        label: "Tree species input label",
        description: "TRee species input description",
        collection: "trees-planted",
        validation: { required: true },
        model: "projects"
      },
      {
        name: "tree_species_with_number",
        inputType: "treeSpecies",
        label: "Tree species with number input label",
        description: "TRee species with number input description",
        additionalProps: { with_numbers: true },
        validation: { required: true },
        model: "projects"
      }
    ]
  },
  {
    id: "fundingSources",
    title: "Funding Sources",
    fields: [
      {
        name: "data_entry",
        validation: { required: true },
        inputType: "fundingType",
        label: "What are your funding sources?*",
        description: "Add a description for jobs created."
      }
    ]
  },
  {
    id: "infoProposedProjects",
    title: "Info of proposed projects",
    fields: [
      {
        name: "jobs-breakdown",
        label: "Proposed # of New Paid Jobs to be Created breakdown*",
        description: "Please write the total number broken down by gender.",
        inputType: "tableInput",
        tableHeaders: [
          { order: 1, label: "Breakdown" },
          { order: 2, label: "Percentage (%)" }
        ],
        children: [
          {
            label: "% New paid full-time hobs",
            name: "full-time-jobs",
            placeholder: "Enter a value",
            validation: { required: true },
            inputType: "number"
          },
          {
            label: "% New paid part-time jobs",
            name: "part-time-jobs",
            placeholder: "Enter a value",
            validation: { required: true },
            inputType: "number"
          },
          {
            label: "% of women employees",
            name: "women-employees",
            placeholder: "Enter a value",
            validation: { required: true },
            inputType: "number"
          }
        ]
      }
    ]
  },
  {
    id: "map",
    title: "Map",
    fields: [
      {
        name: "map",
        label: "What is the name of your proposed project?",
        inputType: "mapInput",
        validation: { required: true },
        model: "projects"
      }
    ]
  }
]);

export const CreateForm: Story = {
  render: (args: Props) => (
    <QueryClientProvider client={client}>
      <div className="flex w-full justify-center bg-background px-3">
        <Component {...args} />
      </div>
    </QueryClientProvider>
  ),
  args: {
    fieldsProvider: PROVIDER,
    onStepChange: Log.info,
    onChange: Log.info,
    nextButtonText: "Save and Continue",
    submitButtonText: "Submit",
    hideBackButton: false,
    initialStepIndex: 2,

    tabOptions: {
      disableFutureTabs: false,
      markDone: true
    }
  }
};

export const EditForm = {
  ...CreateForm,
  args: {
    fieldsProvider: PROVIDER,
    onStepChange: Log.info,
    onChange: Log.info,
    nextButtonText: "Save",
    submitButtonText: "Save",
    hideBackButton: true,
    hideSaveAndCloseButton: true,

    header: {
      hide: true
    },
    tabOptions: {
      disableFutureTabs: false,
      markDone: false
    },
    disableAutoProgress: true,
    defaultValues: {
      text_field: "pre populated value",
      number_field: 34,
      select_input: "1"
    }
  }
};
