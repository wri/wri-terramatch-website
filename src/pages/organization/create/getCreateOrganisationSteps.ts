import { useT } from "@transifex/react";
import * as yup from "yup";

import { FieldType, FormStepSchema } from "@/components/extensive/WizardForm/types";
import { getCountriesOptions } from "@/constants/options/countries";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { FileType } from "@/types/common";
import { urlValidation } from "@/utils/yup";

const ModelName = "organisation";

export const getSteps = (t: typeof useT, uuid: string): FormStepSchema[] => {
  return [
    {
      title: t("Organization Details"),
      subtitle: t(
        "Please provide some basic details about your organization, including your organization's name and address, and let us know whether you are looking to fund or develop restoration projects. Please note, once submitted, you will not be able to amend your organization name or account type."
      ),
      fields: [
        {
          name: "type",
          label: t("Organization Type"),
          placeholder: t("Select Organization Type"),
          type: FieldType.Dropdown,
          validation: yup.string().required(),
          fieldProps: {
            required: true,
            options: getOrganisationTypeOptions(t)
          }
        },
        {
          name: "name",
          label: t("Organization Legal Name"),
          placeholder: t("Organization Legal Name"),
          type: FieldType.TextArea,
          validation: yup.string().required(),
          fieldProps: { required: true }
        },
        {
          name: "hq_street_1",
          label: t("Headquarters Street address"),
          placeholder: t("Add Headquarters Street address"),
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: { type: "text", required: true }
        },
        {
          name: "hq_street_2",
          label: t("Headquarters Street address 2"),
          placeholder: t("Add Headquarters Street address 2"),
          type: FieldType.Input,
          validation: yup.string(),
          fieldProps: { type: "text" }
        },
        {
          name: "hq_city",
          label: t("Headquarters address City"),
          placeholder: t("Add Headquarters address City"),
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: { type: "text", required: true }
        },
        {
          name: "hq_state",
          label: t("Headquarters address State/Province"),
          placeholder: t("Headquarters address State/Province"),
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: { type: "text", required: true }
        },
        {
          name: "hq_zipcode",
          label: t("Headquarters address Zipcode"),
          placeholder: t("Add Headquarters address Zipcode"),
          type: FieldType.Input,
          validation: yup.string(),
          fieldProps: { type: "text" }
        },
        {
          name: "hq_country",
          label: t("Headquarters address Country"),
          placeholder: t("Add Headquarters address Country"),
          type: FieldType.Dropdown,
          validation: yup.string().required(),
          fieldProps: { options: getCountriesOptions(t), required: true }
        },
        {
          name: "phone",
          label: t("Organization WhatsApp Enabled Phone Number"),
          placeholder: t("Add Phone Number"),
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: { type: "tel", required: true }
        },
        {
          name: "countries",
          label: t("What countries is your organization legally registered in?"),
          description: t(
            "Please select the relevant countries where your organization is legally registered to operate."
          ),
          placeholder: t("Select Country"),
          type: FieldType.Dropdown,
          validation: yup.array().required(),
          fieldProps: { options: getCountriesOptions(t), multiSelect: true, required: true }
        },
        {
          name: "legal_registration",
          type: FieldType.FileUpload,
          label: t("Proof of local legal registration, incorporation, or right to operate"),
          placeholder: t("Add Registration Files"),
          validation: yup.array(),
          fieldProps: {
            uuid,
            collection: "legal_registration",
            model: ModelName,
            allowMultiple: true,
            maxFileSize: 5,
            accept: [FileType.ImagePdf]
          }
        }
      ]
    },
    {
      title: t("Social Media Presence"),
      subtitle: t(
        "If your organization has a website or any social media accounts, please share them below. Seeing your online presence helps us understand more about the history and purpose of your organization, but it is not a requirement."
      ),
      fields: [
        {
          name: "web_url",
          label: t("Organization Website URL"),
          placeholder: t("Add Organization website URL"),
          type: FieldType.Input,
          validation: urlValidation(t),
          fieldProps: { type: "url" }
        },
        {
          name: "facebook_url",
          label: t("Organization Facebook URL"),
          placeholder: t("Add Organization Facebook URL"),
          type: FieldType.Input,
          validation: urlValidation(t),
          fieldProps: { type: "url" }
        },
        {
          name: "twitter_url",
          label: t("Organization Twitter URL"),
          placeholder: t("Add Organization  Twitter URL"),
          type: FieldType.Input,
          validation: urlValidation(t),
          fieldProps: { type: "url" }
        },
        {
          name: "instagram_url",
          label: t("Organization Instagram URL"),
          placeholder: t("Add Organization Instagram URL"),
          type: FieldType.Input,
          validation: urlValidation(t),
          fieldProps: { type: "url" }
        },
        {
          name: "linkedin_url",
          label: t("Organization Linkedin URL"),
          placeholder: t("Add Organization Linkedin URL"),
          type: FieldType.Input,
          validation: urlValidation(t),
          fieldProps: { type: "url" }
        }
      ]
    },
    {
      title: t("Organization Profile"),
      fields: [
        {
          name: "description",
          type: FieldType.TextArea,
          label: t("Organization Description"),
          placeholder: t("Add Organization Description"),
          validation: yup.string(),
          fieldProps: {}
        },
        {
          name: "logo",
          type: FieldType.FileUpload,
          label: t("Your organization logo"),
          placeholder: t("Add your organization logo"),
          validation: yup.object(),
          fieldProps: {
            uuid,
            collection: "logo",
            model: ModelName,
            maxFileSize: 3,
            accept: [FileType.Image]
          }
        },
        {
          name: "cover",
          type: FieldType.FileUpload,
          label: t("Cover photo"),
          placeholder: t("Add a cover photo"),
          validation: yup.object(),
          fieldProps: {
            uuid,
            collection: "cover",
            model: ModelName,
            maxFileSize: 20,
            accept: [FileType.Image]
          }
        }
      ]
    }
  ];
};
