import { useT } from "@transifex/react";
import * as yup from "yup";

import { FieldType, FormStepSchema } from "@/components/extensive/WizardForm/types";
import { getCountriesOptions } from "@/constants/options/countries";
import {
  getFarmersEngagementStrategyOptions,
  getWomenEngagementStrategyOptions,
  getYoungerThan35EngagementStrategyOptions
} from "@/constants/options/engagementStrategy";
import { getLanguageOptions } from "@/constants/options/languages";
import { getMonthOptions } from "@/constants/options/months";
import { getOrganisationTypeOptions } from "@/constants/options/organisations";
import { getRestorationInterventionTypeOptions } from "@/constants/options/restorationInterventionTypes";
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
          type: FieldType.Input,
          validation: yup.string().required(),
          fieldProps: { type: "text", required: true }
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
          name: "additional",
          type: FieldType.FileUpload,
          label: t("Other additional documents"),
          placeholder: t("Add additional documents"),
          validation: yup.array(),
          fieldProps: {
            uuid,
            collection: "additional",
            model: ModelName,
            allowMultiple: true,
            maxFileSize: 10,
            accept: [FileType.Document, FileType.Image, FileType.CsvExcel]
          }
        }
      ]
    },
    {
      title: t("Organizational Governance"),
      fields: [
        {
          name: "countries",
          label: t("In what countries is your organisation legally registered?"),
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
        },
        {
          name: "description",
          type: FieldType.TextArea,
          label: t("Organization Description"),
          placeholder: t("Add Organization Description"),
          validation: yup.string(),
          fieldProps: {}
        },
        {
          name: "founding_date",
          type: FieldType.Input,
          label: t("Date Organization Founded"),
          validation: yup.date().optional(),
          fieldProps: {
            type: "date"
          }
        },
        {
          name: "languages",
          label: t("Organizational Languages"),
          placeholder: t("Organizational Languages"),
          type: FieldType.Dropdown,
          validation: yup.array(),
          fieldProps: {
            options: getLanguageOptions(t),
            multiSelect: true,
            required: false
          }
        },
        {
          name: "reference",
          type: FieldType.FileUpload,
          label: t("Reference Letters"),
          placeholder: t("Add Reference Letters"),
          validation: yup.array().optional(),
          fieldProps: {
            uuid,
            collection: "reference",
            model: ModelName,
            allowMultiple: true,
            maxFileSize: 5,
            accept: [FileType.Pdf]
          }
        },
        {
          name: "leadership_team",
          type: FieldType.LeadershipTeamDataTable,
          label: t("Leadership team (providing your senior leaders by position, gender, and age)"),
          description: t("Please list the members of your organization’s board of directors."),
          validation: yup.array(),
          fieldProps: {}
        },
        {
          name: "employees",
          type: FieldType.InputTable,
          label: t("Your employees"),
          validation: yup.object({
            ft_permanent_employees: yup.number(),
            pt_permanent_employees: yup.number(),
            temp_employees: yup.number(),
            female_employees: yup.number(),
            male_employees: yup.number(),
            young_employees: yup.number()
          }),
          fieldProps: {
            headers: [t("Employee Type"), "Employee Count"],
            rows: [
              {
                name: "ft_permanent_employees",
                label: "Number of full-time permanent employees",
                placeholder: "Enter a Value",
                type: FieldType.Input,
                validation: yup.number().min(0).max(999999),
                fieldProps: {
                  type: "number"
                }
              },
              {
                name: "pt_permanent_employees",
                label: "Number of part-time permanent employees",
                placeholder: "Enter a Value",
                type: FieldType.Input,
                validation: yup.number().min(0).max(999999),
                fieldProps: {
                  type: "number"
                }
              },
              {
                name: "temp_employees",
                label: "Number of temporary employees",
                placeholder: "Enter a Value",
                type: FieldType.Input,
                validation: yup.number().min(0).max(999999),
                fieldProps: {
                  type: "number"
                }
              },
              {
                name: "female_employees",
                label: "Number of female employees",
                placeholder: "Enter a Value",
                type: FieldType.Input,
                validation: yup.number().min(0).max(999999),
                fieldProps: {
                  type: "number"
                }
              },
              {
                name: "male_employees",
                label: "Number of male employees",
                placeholder: "Enter a Value",
                type: FieldType.Input,
                validation: yup.number().min(0).max(999999),
                fieldProps: {
                  type: "number"
                }
              },
              {
                name: "young_employees",
                label: "Number of employees between and including ages 18 and 35",
                placeholder: "Enter a Value",
                type: FieldType.Input,
                validation: yup.number().min(0).max(999999),
                fieldProps: {
                  type: "number"
                }
              },
              {
                name: "over_35_employees",
                label: "Number of employees older than 35 years of age",
                placeholder: "Enter a Value",
                type: FieldType.Input,
                validation: yup.number().min(0).max(999999),
                fieldProps: {
                  type: "number"
                }
              }
            ]
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
          placeholder: t("Website URL"),
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
          name: "logo",
          type: FieldType.FileUpload,
          label: t("Upload your organization logo"),
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
          label: t("Upload a cover photo"),
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
    },
    {
      title: t("Financial Scope of Work (Historic)"),
      fields: [
        {
          name: "fin_start_month",
          label: t("Start of financial year (month)"),
          type: FieldType.Dropdown,
          validation: yup.number(),
          fieldProps: {
            options: getMonthOptions(t),
            required: false
          }
        },
        {
          name: "fin_budget_3year",
          label: t("Organization Budget in USD for (-{count} years from today)", { count: 3 }),
          placeholder: t("Organization Budget in USD"),
          type: FieldType.Input,
          validation: yup.number().min(0).max(9999999999999),
          fieldProps: { type: "number" }
        },
        {
          name: "op_budget_3year",
          type: FieldType.FileUpload,
          label: t("Upload your organization's operating budget from {count} years ago", { count: 3 }),
          placeholder: t("Upload your organization's operating budget"),
          validation: yup.array(),
          fieldProps: {
            uuid,
            collection: "op_budget_3year",
            model: ModelName,
            allowMultiple: true,
            maxFileSize: 5,
            accept: [FileType.CsvExcel, FileType.Pdf]
          }
        },
        {
          name: "fin_budget_2year",
          label: t("Organization Budget in USD for (-{count} years from today)", { count: 2 }),
          placeholder: t("Organization Budget in USD"),
          type: FieldType.Input,
          validation: yup.number().min(0).max(9999999999999),
          fieldProps: { type: "number" }
        },
        {
          name: "op_budget_2year",
          type: FieldType.FileUpload,
          label: t("Upload your organization's operating budget from {count} years ago", { count: 2 }),
          placeholder: t("Upload your organization's operating budget"),
          validation: yup.array(),
          fieldProps: {
            uuid,
            collection: "op_budget_2year",
            model: ModelName,
            allowMultiple: true,
            maxFileSize: 5,
            accept: [FileType.CsvExcel, FileType.Pdf]
          }
        },
        {
          name: "fin_budget_1year",
          label: t("Organization Budget in USD for (-{count} years from today)", { count: 1 }),
          placeholder: t("Organization Budget in USD"),
          type: FieldType.Input,
          validation: yup.number().min(0).max(9999999999999),
          fieldProps: { type: "number" }
        },
        {
          name: "op_budget_1year",
          type: FieldType.FileUpload,
          label: t("Upload your organization's operating budget from last year"),
          placeholder: t("Upload your organization's operating budget"),
          validation: yup.array(),
          fieldProps: {
            uuid,
            collection: "op_budget_1year",
            model: ModelName,
            allowMultiple: true,
            maxFileSize: 5,
            accept: [FileType.CsvExcel, FileType.Pdf]
          }
        },
        {
          name: "fin_budget_current_year",
          label: t("Organization Budget in USD for this year"),
          placeholder: t("Organization Budget in USD"),
          type: FieldType.Input,
          validation: yup.number().min(0).max(9999999999999),
          fieldProps: { type: "number" }
        },
        {
          name: "bank_statements",
          type: FieldType.FileUpload,
          label: t("Upload your organization's bank statements"),
          placeholder: t("Upload bank statements"),
          validation: yup.array(),
          fieldProps: {
            uuid,
            collection: "bank_statements",
            model: ModelName,
            allowMultiple: true,
            maxFileSize: 5,
            accept: [FileType.CsvExcel, FileType.Pdf]
          }
        },
        {
          name: "funding_types",
          type: FieldType.FundingTypeDataTable,
          label: t("Breakdown of Recent (past 4 years) Funding History by Funding Type and Amount"),
          validation: yup.array(),
          fieldProps: {}
        },
        {
          name: "additional_funding_details",
          label: t("Additional details about funding strucuture, organisational support, etc."),
          type: FieldType.TextArea,
          validation: yup.string(),
          fieldProps: {}
        }
      ]
    },
    {
      title: t("Past Community Engagement Experience"),
      fields: [
        {
          name: "engagement_farmers",
          label: t("Enagement: Farmers"),
          type: FieldType.Dropdown,
          validation: yup.array(),
          fieldProps: {
            options: getFarmersEngagementStrategyOptions(t),
            multiSelect: true
          }
        },
        {
          name: "engagement_women",
          label: t("Engagement: Women"),
          type: FieldType.Dropdown,
          validation: yup.array(),
          fieldProps: {
            options: getWomenEngagementStrategyOptions(t),
            multiSelect: true
          }
        },
        {
          name: "engagement_youth",
          label: t("Engagement: Youth"),
          type: FieldType.Dropdown,
          validation: yup.array(),
          fieldProps: {
            options: getYoungerThan35EngagementStrategyOptions(t),
            multiSelect: true
          }
        },
        {
          name: "community_experience",
          label: t("Community Engagement Experience/Approach"),
          type: FieldType.TextArea,
          validation: yup.string(),
          fieldProps: {}
        },
        {
          name: "total_engaged_community_members_3yr",
          label: t("Community Engagement Numbers"),
          type: FieldType.Input,
          validation: yup.number(),
          fieldProps: { type: "number" }
        }
      ]
    },
    {
      title: t("Past Restoration Experience"),
      fields: [
        {
          name: "relevant_experience_years",
          label: t("Years of relevant restoration experience"),
          type: FieldType.Input,
          validation: yup.number().min(0).max(150),
          fieldProps: { type: "number" }
        },
        {
          name: "ha_restored_total",
          label: t("Total Hectares Restored"),
          placeholder: t("Total Hectares Restored"),
          type: FieldType.Input,
          validation: yup.number().min(0).max(9999999999999),
          fieldProps: { type: "number" }
        },
        {
          name: "ha_restored_3year",
          label: t("Hectares Restored in the last 3 years"),
          type: FieldType.Input,
          validation: yup.number().min(0).max(9999999999999),
          fieldProps: { type: "number" }
        },
        {
          name: "trees_grown_total",
          label: t("Total Trees Grown"),
          placeholder: t("Total Trees Grown"),
          type: FieldType.Input,
          validation: yup.number().min(0).max(9999999999999),
          fieldProps: { type: "number" }
        },
        {
          name: "trees_grown_3year",
          label: t("Trees Grown in the last 3 years"),
          placeholder: t("Trees Grown in the last 3 years"),
          type: FieldType.Input,
          validation: yup.number().min(0).max(9999999999999),
          fieldProps: { type: "number" }
        },
        {
          name: "tree_species",
          label: t("Tree Species Grown"),
          type: FieldType.TreeSpecies,
          validation: yup.array(
            yup.object({
              name: yup.string().required()
            })
          ),
          fieldProps: {
            title: t("Tree Species"),
            buttonCaptionSuffix: t("Species"),
            uuid,
            model: ModelName,
            withNumbers: false
          }
        },
        {
          name: "avg_tree_survival_rate",
          label: t("Average Tree Survival Rate"),
          type: FieldType.Input,
          validation: yup.number().min(0).max(100),
          fieldProps: { type: "number" }
        },
        {
          name: "restoration_types_implemented",
          label: t("Restoration Intervention Types Implemented"),
          type: FieldType.Dropdown,
          validation: yup.array(),
          fieldProps: { options: getRestorationInterventionTypeOptions(t), multiSelect: true }
        },
        {
          name: "tree_maintenance_aftercare_approach",
          label: t("Tree Maintenance & After Care Approach"),
          type: FieldType.TextArea,
          validation: yup.string(),
          fieldProps: {}
        },
        {
          name: "restored_areas_description",
          label: t("Description of areas restored"),
          type: FieldType.TextArea,
          validation: yup.string(),
          fieldProps: {}
        },
        {
          name: "monitoring_evaluation_experience",
          label: t("Monitoring and evaluation experience"),
          type: FieldType.TextArea,
          validation: yup.string(),
          fieldProps: {}
        },
        {
          name: "historic_monitoring_geojson",
          label: t("Historic monitoring shapefile upload"),
          type: FieldType.Map,
          validation: yup.object(),
          fieldProps: {}
        },
        {
          name: "previous_annual_reports",
          type: FieldType.FileUpload,
          label: t("Previous Annual Reports for Monitored Restoration Projects"),
          description: t(
            "You can upload up to 5 examples of previous monitoring reports that you have produced for past restoration projects. Reports that you submitted to funders, government agencies, or technical partners are especially welcome."
          ),
          validation: yup.array(),
          fieldProps: {
            uuid,
            collection: "previous_annual_reports",
            model: ModelName,
            allowMultiple: true,
            maxFileSize: 10
          }
        },
        {
          name: "historic_restoration",
          type: FieldType.FileUpload,
          label: t("Photos of past restoration work"),
          description: t(
            "Please upload as many photos of your past restoration work as possible. Planting photos, before-and-after images, community engagement pictures, geotagged photos, and aerial images are especially valuable."
          ),
          validation: yup.array(),
          fieldProps: {
            uuid,
            collection: "historic_restoration",
            model: ModelName,
            allowMultiple: true,
            maxFileSize: 25,
            accept: [FileType.Image]
          }
        }
      ]
    }
  ];
};
