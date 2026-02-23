import { useT } from "@transifex/react";
import * as yup from "yup";

import {
  getFarmersEngagementStrategyOptions,
  getWomenEngagementStrategyOptions,
  getYoungerThan35EngagementStrategyOptions
} from "@/constants/options/engagementStrategy";
import { getLanguageOptions } from "@/constants/options/languages";
import { getMonthOptions } from "@/constants/options/months";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { getRestorationInterventionTypeOptions } from "@/constants/options/restorationInterventionTypes";
import { LocalStep } from "@/context/wizardForm.provider";
import { FileType, Option } from "@/types/common";

export const getSteps = (t: typeof useT, countryOptions: Option[]): LocalStep[] => [
  {
    id: "orgDetails",
    title: t("Organization Details"),
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
        name: "hqStreet1",
        label: t("Headquarters Street address"),
        placeholder: t("Add Headquarters Street address"),
        inputType: "text",
        validation: { required: true }
      },
      {
        name: "hqStreet2",
        label: t("Headquarters Street address 2"),
        placeholder: t("Add Headquarters Street address 2"),
        inputType: "text"
      },
      {
        name: "hqCity",
        label: t("Headquarters address City"),
        placeholder: t("Add Headquarters address City"),
        inputType: "text",
        validation: { required: true }
      },
      {
        name: "hqState",
        label: t("Headquarters address State/Province"),
        placeholder: t("Headquarters address State/Province"),
        inputType: "text",
        validation: { required: true }
      },
      {
        name: "hqZipcode",
        label: t("Headquarters address Zipcode"),
        placeholder: t("Add Headquarters address Zipcode"),
        inputType: "text"
      },
      {
        name: "hqCountry",
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
        name: "additional",
        inputType: "file",
        label: t("Other additional documents"),
        placeholder: t("Add additional documents"),
        collection: "additional",
        multiChoice: true,
        model: "organisations",
        additionalProps: { max: 10, accept: [FileType.Document, FileType.Image, FileType.CsvExcel] }
      }
    ]
  },

  {
    id: "governance",
    title: t("Organizational Governance"),
    fields: [
      {
        name: "countries",
        label: t("In what countries is your organisation legally registered?"),
        description: t(
          "Please select the relevant countries where your organization is legally registered to operate."
        ),
        placeholder: t("Select Country"),
        inputType: "select",
        validation: { required: true },
        multiChoice: true,
        options: countryOptions
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
      },
      {
        name: "description",
        inputType: "long-text",
        label: t("Organization Description"),
        placeholder: t("Add Organization Description")
      },
      {
        name: "foundingDate",
        inputType: "date",
        label: t("Date Organization Founded")
      },
      {
        name: "languages",
        label: t("Organizational Languages"),
        placeholder: t("Organizational Languages"),
        inputType: "select",
        multiChoice: true,
        options: getLanguageOptions(t)
      },
      {
        name: "reference",
        inputType: "file",
        label: t("Reference Letters"),
        placeholder: t("Add Reference Letters"),
        multiChoice: true,
        collection: "reference",
        model: "organisations",
        additionalProps: { max: 5, accept: [FileType.Pdf] }
      },
      {
        name: "leadership_team",
        inputType: "leaderships",
        label: t("Leadership team (providing your senior leaders by position, gender, and age)"),
        description: t("Please list the members of your organization’s board of directors."),
        collection: "leadership-team"
      },
      {
        name: "ownership_stake",
        inputType: "ownershipStake",
        label: t("Ownership participation (providing your senior leaders by position)"),
        description: t("Please list the ownership of your organization’s.")
      },
      {
        name: "employees",
        inputType: "tableInput",
        label: t("Your employees"),
        tableHeaders: [t("Employee Type"), t("Employee Count")],
        children: [
          {
            name: "ftPermanentEmployees",
            label: "Number of full-time permanent employees",
            placeholder: "Enter a Value",
            inputType: "number",
            validation: { min: 0, max: 999999 }
          },
          {
            name: "ptPermanentEmployees",
            label: "Number of part-time permanent employees",
            placeholder: "Enter a Value",
            inputType: "number",
            validation: { min: 0, max: 999999 }
          },
          {
            name: "tempEmployees",
            label: "Number of temporary employees",
            placeholder: "Enter a Value",
            inputType: "number",
            validation: { min: 0, max: 999999 }
          },
          {
            name: "femaleEmployees",
            label: "Number of female employees",
            placeholder: "Enter a Value",
            inputType: "number",
            validation: { min: 0, max: 999999 }
          },
          {
            name: "maleEmployees",
            label: "Number of male employees",
            placeholder: "Enter a Value",
            inputType: "number",
            validation: { min: 0, max: 999999 }
          },
          {
            name: "youngEmployees",
            label: "Number of employees between and including ages 18 and 35",
            placeholder: "Enter a Value",
            inputType: "number",
            validation: { min: 0, max: 999999 }
          },
          {
            name: "over35Employees",
            label: "Number of employees older than 35 years of age",
            placeholder: "Enter a Value",
            inputType: "number",
            validation: { min: 0, max: 999999 }
          }
        ]
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
        name: "webUrl",
        label: t("Organization Website URL"),
        placeholder: t("Website URL"),
        inputType: "url"
      },
      {
        name: "facebookUrl",
        label: t("Organization Facebook URL"),
        placeholder: t("Add Organization Facebook URL"),
        inputType: "url"
      },
      {
        name: "twitterUrl",
        label: t("Organization Twitter URL"),
        placeholder: t("Add Organization  Twitter URL"),
        inputType: "url"
      },
      {
        name: "instagramUrl",
        label: t("Organization Instagram URL"),
        placeholder: t("Add Organization Instagram URL"),
        inputType: "url"
      },
      {
        name: "linkedinUrl",
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
        name: "logo",
        inputType: "file",
        label: t("Upload your organization logo"),
        placeholder: t("Add your organization logo"),
        collection: "logo",
        model: "organisations",
        additionalProps: { max: 3, accept: [FileType.Image] }
      },
      {
        name: "cover",
        inputType: "file",
        label: t("Upload a cover photo"),
        placeholder: t("Add a cover photo"),
        collection: "cover",
        model: "organisations",
        additionalProps: { max: 20, accept: [FileType.Image] }
      }
    ]
  },

  {
    id: "historicFinancial",
    title: t("Financial Scope of Work (Historic)"),
    fields: [
      {
        name: "finStartMonth",
        label: t("Start of financial year (month)"),
        inputType: "select",
        options: getMonthOptions(t)
      },
      {
        name: "bank_statements",
        inputType: "file",
        label: t("Upload your organization's bank statements"),
        placeholder: t("Upload bank statements"),
        collection: "bank_statements",
        multiChoice: true,
        model: "organisations",
        additionalProps: { max: 5, accept: [FileType.CsvExcel, FileType.Pdf] }
      },
      {
        name: "funding_types",
        inputType: "fundingType",
        label: t("Breakdown of Recent (past 4 years) Funding History by Funding Type and Amount")
      },
      {
        name: "additionalFundingDetails",
        label: t("Additional details about funding strucuture, organisational support, etc."),
        inputType: "long-text"
      }
    ]
  },

  {
    id: "communityEngagement",
    title: t("Past Community Engagement Experience"),
    fields: [
      {
        name: "engagementFarmers",
        label: t("Enagement: Farmers"),
        inputType: "select",
        multiChoice: true,
        options: getFarmersEngagementStrategyOptions(t)
      },
      {
        name: "engagementWomen",
        label: t("Engagement: Women"),
        inputType: "select",
        multiChoice: true,
        options: getWomenEngagementStrategyOptions(t)
      },
      {
        name: "engagementYouth",
        label: t("Engagement: Youth"),
        inputType: "select",
        validation: yup.array(),
        multiChoice: true,
        options: getYoungerThan35EngagementStrategyOptions(t)
      },
      {
        name: "communityExperience",
        label: t("Community Engagement Experience/Approach"),
        inputType: "long-text"
      },
      {
        name: "totalEngagedCommunityMembers3Yr",
        label: t("Community Engagement Numbers"),
        inputType: "number"
      }
    ]
  },

  {
    id: "pastRestoration",
    title: t("Past Restoration Experience"),
    fields: [
      {
        name: "relevantExperienceYears",
        label: t("Years of relevant restoration experience"),
        inputType: "number",
        validation: { min: 0, max: 150 }
      },
      {
        name: "haRestoredTotal",
        label: t("Total Hectares Restored"),
        placeholder: t("Total Hectares Restored"),
        inputType: "number",
        validation: { min: 0, max: 9999999999999 }
      },
      {
        name: "haRestored3Year",
        label: t("Hectares Restored in the last 3 years"),
        inputType: "number",
        validation: { min: 0, max: 9999999999999 }
      },
      {
        name: "treesGrownTotal",
        label: t("Total Trees Grown"),
        placeholder: t("Total Trees Grown"),
        inputType: "number",
        validation: { min: 0, max: 9999999999999 }
      },
      {
        name: "treesGrown3Year",
        label: t("Trees Grown in the last 3 years"),
        placeholder: t("Trees Grown in the last 3 years"),
        inputType: "number",
        validation: { min: 0, max: 9999999999999 }
      },
      {
        name: "tree_species_historical",
        label: t("Tree Species Grown"),
        inputType: "treeSpecies",
        model: "organisations",
        additionalProps: { with_numbers: false }
      },
      {
        name: "avgTreeSurvivalRate",
        label: t("Average Tree Survival Rate"),
        inputType: "number",
        validation: { min: 0, max: 100 }
      },
      {
        name: "restorationTypesImplemented",
        label: t("Restoration Intervention Types Implemented"),
        inputType: "select",
        multiChoice: true,
        options: getRestorationInterventionTypeOptions(t)
      },
      {
        name: "treeMaintenanceAftercareApproach",
        label: t("Tree Maintenance & After Care Approach"),
        inputType: "long-text"
      },
      {
        name: "restoredAreasDescription",
        label: t("Description of areas restored"),
        inputType: "long-text"
      },
      {
        name: "monitoringEvaluationExperience",
        label: t("Monitoring and evaluation experience"),
        inputType: "long-text"
      },
      {
        name: "historic_monitoring_geojson",
        label: t("Historic monitoring shapefile upload"),
        inputType: "mapInput",
        model: "organisations"
      },
      {
        name: "previous_annual_reports",
        inputType: "file",
        label: t("Previous Annual Reports for Monitored Restoration Projects"),
        description: t(
          "You can upload up to 5 examples of previous monitoring reports that you have produced for past restoration projects. Reports that you submitted to funders, government agencies, or technical partners are especially welcome."
        ),
        model: "organisations",
        collection: "previous_annual_reports",
        multiChoice: true,
        additionalProps: { max: 10 }
      },
      {
        name: "historic_restoration",
        inputType: "file",
        label: t("Photos of past restoration work"),
        description: t(
          "Please upload as many photos of your past restoration work as possible. Planting photos, before-and-after images, community engagement pictures, geotagged photos, and aerial images are especially valuable."
        ),
        model: "organisations",
        collection: "historic_restoration",
        multiChoice: true,
        additionalProps: { max: 25, accept: [FileType.Image] }
      }
    ]
  }
];
