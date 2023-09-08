import "@/yup.locale";

import { Meta, StoryObj } from "@storybook/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as yup from "yup";

import {
  getFundingTypeFields,
  getFundingTypeTableHeaders
} from "@/components/elements/Inputs/DataTable/RHFFundingTypeDataTable";
import { getCountriesOptions } from "@/constants/options/countries";
import { FileType } from "@/types/common";

import Component, { WizardFormProps as Props } from ".";
import { FieldType, FormStepSchema } from "./types";

const meta: Meta<typeof Component> = {
  title: "Components/Extensive/Form/Wizard",
  component: Component
};

export default meta;
type Story = StoryObj<typeof Component>;

const client = new QueryClient();

const getSteps = (edit?: boolean): FormStepSchema[] => {
  return [
    {
      tabTitle: edit ? "Simple Inputs" : undefined,
      title: "Simple Inputs",
      subtitle: "These are all simple inputs",
      fields: [
        {
          name: "text_field",
          label: "Simple text field",
          placeholder: "Please enter ...",
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: { type: "text", required: true }
        },
        {
          name: "number_field",
          label: "Simple number field",
          placeholder: "Please enter ...",
          type: FieldType.Input,
          validation: yup.number().required(),
          fieldProps: { type: "number", required: true }
        }
      ]
    },
    {
      tabTitle: edit ? "Dropdown Inputs" : undefined,
      title: "Dropdown Inputs",
      subtitle: "These are all simple inputs",
      fields: [
        {
          name: "dropdown_input",
          label: "Dropdown component",
          placeholder: "Select ...",
          type: FieldType.Dropdown,
          validation: yup.string().required(),
          fieldProps: {
            required: true,
            hasOtherOptions: true,
            options: [
              { title: "Option 1", value: "1" },
              { title: "Option 2", value: "2" },
              { title: "Option 3", value: "3" }
            ]
          }
        },
        {
          name: "multi_dropdown_input",
          label: "Multi-Select Dropdown component",
          placeholder: "Select ...",
          type: FieldType.Dropdown,
          validation: yup.array().min(1).required(),
          fieldProps: {
            multiSelect: true,
            required: true,
            hasOtherOptions: true,
            options: [
              { title: "Option 1", value: "1" },
              { title: "Option 2", value: "2" },
              { title: "Option 3", value: "3" },
              { title: "Option 4", value: "4" }
            ]
          }
        },
        {
          name: "field_country",
          label: "Country selector",
          placeholder: "Select country ...",
          type: FieldType.Dropdown,
          validation: yup.string().required(),
          fieldProps: { options: getCountriesOptions(), required: true }
        }
      ]
    },
    {
      tabTitle: edit ? "Select Inputs" : undefined,
      title: "Select Inputs",
      subtitle: "These are all simple inputs",
      fields: [
        {
          name: "select_input",
          label: "Select component",
          placeholder: "Select ...",
          type: FieldType.Select,
          validation: yup.string().required(),
          fieldProps: {
            required: true,
            options: [
              { title: "Option 1", value: "1" },
              { title: "Option 2", value: "2" },
              { title: "Option 3", value: "3" }
            ]
          }
        },
        {
          name: "multi_select_input",
          label: "Multi-Select component",
          placeholder: "Select ...",
          type: FieldType.Select,
          validation: yup.array().min(1).required(),
          fieldProps: {
            multiSelect: true,
            required: true,
            options: [
              { title: "Option 1", value: "1" },
              { title: "Option 2", value: "2" },
              { title: "Option 3", value: "3" },
              { title: "Option 4", value: "4" }
            ]
          }
        }
      ]
    },
    {
      tabTitle: edit ? "File Uploader" : undefined,
      title: "File Uploader",
      subtitle: "These are upload component, uploads won't work here since uuid/collection/model are invalid.",
      fields: [
        {
          name: "Single File Upload",
          type: FieldType.FileUpload,
          label: "Upload a file",
          placeholder: "Add File",
          validation: yup.array(),
          fieldProps: {
            uuid: "uuid",
            collection: "collection",
            model: "model",
            allowMultiple: false,
            maxFileSize: 5,
            accept: [FileType.ImagePdf]
          }
        },
        {
          name: "Multiple File Upload",
          type: FieldType.FileUpload,
          label: "Upload multiple file",
          placeholder: "Add File",
          validation: yup.array(),
          fieldProps: {
            uuid: "uuid",
            collection: "collection",
            model: "model",
            allowMultiple: false,
            maxFileSize: 5,
            accept: [FileType.ImagePdf]
          }
        }
      ]
    },
    {
      title: "Tree species input",
      tabTitle: edit ? "Tree species input" : undefined,
      subtitle: "This is tree species input component",
      fields: [
        {
          name: "tree_species",
          type: FieldType.TreeSpecies,
          label: "Tree species input label",
          description: "TRee species input description",
          fieldProps: {
            required: true,
            uuid: "269dd18c-b713-4a87-9214-bc9c3c403a88",
            model: "project_pitch"
          },
          validation: yup.array(
            yup.object({
              name: yup.string().required()
            })
          )
        },
        {
          name: "tree_species_with_number",
          type: FieldType.TreeSpecies,
          label: "Tree species with number input label",
          description: "TRee species with number input description",

          fieldProps: {
            required: true,
            withNumbers: true,
            uuid: "269dd18c-b713-4a87-9214-bc9c3c403a88",
            model: "project_pitch"
          },
          validation: yup.array(
            yup.object({
              name: yup.string().required(),
              number: yup.number().min(0).required()
            })
          )
        }
      ]
    },
    {
      title: "Funding Sources",
      tabTitle: edit ? "What are your funding sources?*" : undefined,
      fields: [
        {
          name: "data_entry",
          validation: yup.array().required(),
          type: FieldType.DataTable,
          label: "What are your funding sources?*",
          description: "Add a description for jobs created.",
          fieldProps: {
            fields: getFundingTypeFields(),
            tableHeaders: getFundingTypeTableHeaders(),
            addButtonCaption: "Add funding source"
          }
        }
      ]
    },
    {
      title: "Info of proposed projects",
      tabTitle: edit ? "Section subtitle" : undefined,
      fields: [
        {
          name: "jobs-breakdown",
          validation: yup.object({
            "full-time-jobs": yup.number().required(),
            "part-time-jobs": yup.number().required(),
            "women-employees": yup.number().required()
          }),
          label: "Proposed # of New Paid Jobs to be Created breakdown*",
          description: "Please write the total number broken down by gender.",
          type: FieldType.InputTable,
          fieldProps: {
            headers: ["Breakdown", "Percentage (%)"],
            rows: [
              {
                label: "% New paid full-time hobs",
                name: "full-time-jobs",
                placeholder: "Enter a value",
                validation: yup.number().required(),
                type: FieldType.Input,
                fieldProps: { type: "number" }
              },
              {
                label: "% New paid part-time jobs",
                name: "part-time-jobs",
                placeholder: "Enter a value",
                validation: yup.number().required(),
                type: FieldType.Input,
                fieldProps: { type: "number" }
              },
              {
                label: "% of women employees",
                name: "women-employees",
                placeholder: "Enter a value",
                validation: yup.number().required(),
                type: FieldType.Input,
                fieldProps: { type: "number" }
              }
            ]
          }
        }
      ]
    },
    {
      title: "Map",
      tabTitle: edit ? "Draw on Map" : undefined,
      fields: [
        {
          name: "map",
          label: "What is the name of your proposed project?",
          type: FieldType.Map,
          validation: yup.object().required(),
          fieldProps: {
            captureInterventionTypes: true
          }
        }
      ]
    }
  ];
};

export const CreateForm: Story = {
  render: (args: Props) => (
    <QueryClientProvider client={client}>
      <div className="flex w-full justify-center bg-background px-3">
        <Component {...args} />
      </div>
    </QueryClientProvider>
  ),
  args: {
    steps: getSteps(false),
    onStepChange: console.log,
    onChange: console.log,
    nextButtonText: "Save and Continue",
    submitButtonText: "Submit",
    hideBackButton: false,
    initialStepIndex: 2,

    tabOptions: {
      vertical: false,
      disableFutureTabs: false,
      markDone: true
    }
  }
};

export const EditForm = {
  ...CreateForm,
  args: {
    steps: getSteps(true),
    onStepChange: console.log,
    onChange: console.log,
    nextButtonText: "Save",
    submitButtonText: "Save",
    hideBackButton: true,
    hideSaveAndCloseButton: true,

    header: {
      hide: true
    },
    tabOptions: {
      vertical: true,
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
