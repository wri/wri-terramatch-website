import { useT } from "@transifex/react";

import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { LocalSteps } from "@/context/wizardForm.provider";
import { FileType, Option } from "@/types/common";

export const getSteps = (t: typeof useT, countryOptions: Option[]): LocalSteps => [
  {
    id: "orgDetails",
    title: t("Organisation Details"),
    description: t(
      "Please provide some basic details about your organization, including your organization's name and address, and let us know whether you are looking to fund or develop restoration projects. Please note, once submitted, you will not be able to amend your organization name or account type."
    ),
    fields: [
      {
        name: "type",
        label: t("Organization Type"),
        placeholder: t("Select Organization Type"),
        inputType: "select",
        validation: { required: true },
        options: getOrganisationTypeOptions(t)
      },
      {
        name: "name",
        label: t("Organization Legal Name"),
        placeholder: t("Organization Legal Name"),
        inputType: "text",
        validation: { required: true }
      },
      {
        name: "hq_street_1",
        label: t("Headquarters Street address"),
        placeholder: t("Add Headquarters Street address"),
        inputType: "text",
        validation: { required: true }
      },
      {
        name: "hq_street_2",
        label: t("Headquarters Street address 2"),
        placeholder: t("Add Headquarters Street address 2"),
        inputType: "text"
      },
      {
        name: "hq_city",
        label: t("Headquarters address City"),
        placeholder: t("Add Headquarters address City"),
        inputType: "text",
        validation: { required: true }
      },
      {
        name: "hq_state",
        label: t("Headquarters address State/Province"),
        placeholder: t("Headquarters address State/Province"),
        inputType: "text",
        validation: { required: true }
      },
      {
        name: "hq_zipcode",
        label: t("Headquarters address Zipcode"),
        placeholder: t("Add Headquarters address Zipcode"),
        inputType: "text"
      },
      {
        name: "hq_country",
        label: t("Headquarters address Country"),
        placeholder: t("Add Headquarters address Country"),
        inputType: "select",
        validation: { required: true },
        options: countryOptions
      },
      {
        name: "phone",
        label: t("Organization WhatsApp Enabled Phone Number"),
        placeholder: t("Add Phone Number"),
        inputType: "tel",
        validation: { required: true }
      },
      {
        name: "countries",
        label: t("What countries is your organization legally registered in?"),
        description: t(
          "Please select the relevant countries where your organization is legally registered to operate."
        ),
        placeholder: t("Select Country"),
        inputType: "select",
        validation: { required: true },
        options: countryOptions,
        multiChoice: true
      },
      {
        name: "legal_registration",
        inputType: "file",
        label: t("Proof of local legal registration, incorporation, or right to operate"),
        placeholder: t("Add Registration Files"),
        collection: "legal_registration",
        multiChoice: true,
        model: "organisations",
        additionalProps: { max: 5, accept: [FileType.ImagePdf] }
      }
    ]
  },

  {
    id: "socialMedia",
    title: t("Social Media Presence"),
    description: t(
      "If your organization has a website or any social media accounts, please share them below. Seeing your online presence helps us understand more about the history and purpose of your organization, but it is not a requirement."
    ),
    fields: [
      {
        name: "web_url",
        label: t("Organization Website URL"),
        placeholder: t("Add Organization website URL"),
        inputType: "url"
      },
      {
        name: "facebook_url",
        label: t("Organization Facebook URL"),
        placeholder: t("Add Organization Facebook URL"),
        inputType: "url"
      },
      {
        name: "twitter_url",
        label: t("Organization Twitter URL"),
        placeholder: t("Add Organization  Twitter URL"),
        inputType: "url"
      },
      {
        name: "instagram_url",
        label: t("Organization Instagram URL"),
        placeholder: t("Add Organization Instagram URL"),
        inputType: "url"
      },
      {
        name: "linkedin_url",
        label: t("Organization Linkedin URL"),
        placeholder: t("Add Organization Linkedin URL"),
        inputType: "url"
      }
    ]
  },
  {
    id: "profile",
    title: t("Organization Profile"),
    fields: [
      {
        name: "description",
        inputType: "long-text",
        label: t("Organization Description"),
        placeholder: t("Add Organization Description")
      },
      {
        name: "logo",
        inputType: "file",
        label: t("Your organization logo"),
        placeholder: t("Add your organization logo"),
        collection: "logo",
        model: "organisations",
        additionalProps: { max: 3, accept: [FileType.Image] }
      },
      {
        name: "cover",
        inputType: "file",
        label: t("Cover photo"),
        placeholder: t("Add a cover photo"),
        collection: "cover",
        model: "organisations",
        additionalProps: { max: 20, accept: [FileType.Image] }
      }
    ]
  }
];
