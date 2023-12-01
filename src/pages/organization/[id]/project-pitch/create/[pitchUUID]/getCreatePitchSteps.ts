import { useT } from "@transifex/react";
import * as yup from "yup";

import { FieldType, FormStepSchema } from "@/components/extensive/WizardForm/types";
import { getCapacityBuildingNeedOptions } from "@/constants/options/capacityBuildingNeeds";
import { getCountriesOptions } from "@/constants/options/countries";
import { getLandTenureOptions } from "@/constants/options/landTenure";
import { getMarketingReferenceOptions } from "@/constants/options/marketingReferenceOptions";
import { getRestorationInterventionTypeOptions } from "@/constants/options/restorationInterventionTypes";
import { sustainableDevelopmentGoalsOptions } from "@/constants/options/sustainableDevelopmentGoals";
import { FileType } from "@/types/common";

const ModelName = "project-pitch";

export const getSteps = (t: typeof useT, uuid: string): FormStepSchema[] => [
  {
    title: t("Proposed Project Information"),
    fields: [
      {
        name: "project_name",
        label: t("What is the name of your proposed project?"),
        type: FieldType.Input,
        validation: yup.string().required(),
        fieldProps: { type: "text" }
      },
      {
        name: "project_objectives",
        label: t("What are the objectives of your proposed project?"),
        description: t(
          "Please provide details about your project's goals, how you intend to work with communities, how you intend to maintain and monitor your trees, and what your expected impact will be. The more detailed you are, using precise figures, the more accurately our team can screen your application."
        ),
        type: FieldType.TextArea,
        validation: yup.string(),
        fieldProps: {}
      },
      {
        name: "project_country",
        label: t("In what country will your project operate?"),
        description: t(
          "If your project would span in multiple countries, select the main country of operation and provide more details about the geographic scope in the question below."
        ),
        type: FieldType.Dropdown,
        validation: yup.string(),
        fieldProps: { options: getCountriesOptions(t) }
      },
      {
        name: "project_county_district",
        label: t("In which subnational jurisdictions would you carry out this project?"),
        description: t(
          "Please enter the precise name of the district or sub-counties where your project would operate. This should be an official administrative jurisdiction. Please be as precise as possible."
        ),
        type: FieldType.Input,
        validation: yup.string(),
        fieldProps: { type: "text" }
      },
      {
        name: "project_budget",
        label: t("What is your proposed project budget in USD?"),
        type: FieldType.Input,
        validation: yup.string(),
        fieldProps: { type: "number" }
      },
      {
        name: "detailed_project_budget",
        label: t("Please upload a detailed budget for this project."),
        description: t(
          "Non-profit organizations must submit a budget that details how they intend to use this funding to complete the proposed scope of work. <br/><br/>Download the template here, complete it with the required information, and reupload it to in the field below. We will only accept budgets submitted in the correct format. <br/><br/>Guidance on how to prepare and submit this budget can be found within the budget template and at the following <a href='https://terramatchsupport.zendesk.com/hc/en-us/articles/14837545925147'>link</a>."
        ),
        type: FieldType.FileUpload,
        validation: yup.object(),
        fieldProps: {
          uuid,
          model: ModelName,
          collection: "detailed_project_budget",
          accept: [FileType.CsvExcel]
        }
      },
      {
        name: "proj_partner_info",
        label: t("Which partner organizations do you intend to engage during this project?"),
        description: t(
          "If your project is delivered in conjunction with an additional non-profit or for-profit project developer, a government agency, a technical partner, a university, or any other partner, list them all and explain each of their proposed roles. You are encouraged to submit letters of recommendation from each of these partners before submitting this application."
        ),
        type: FieldType.TextArea,
        validation: yup.string(),
        fieldProps: {}
      },
      {
        name: "land_tenure_proj_area",
        label: t("Which of the following land tenure arrangements govern your project area?"),
        description: t(`
          Indicate which of the following land tenure arrangements govern the proposed project area. If there are multiple types of land use or ownership systems in this areas, select all that apply.
          <br/><br/>
          The land tenure types are defined as follows:
          <br/><br/>
          Private land is owned and managed by a private landowner or company.<br/>
          Public land is managed or owned by a government body (except for national parks or reserves).<br/>
          Indigenous land is governed by indigenous customary tenure and other community agreements.<br/>
          Communal land is acquired, possessed, and transferred under community-based regimes and is typically under customary tenure systems.<br/>
          National protected areas are protected areas, parks, or reserves managed by the corresponding national body. These lands typically have regulations on access and use and are managed for the purpose of conserving nature and natural resources.<br/>
          Other land is any land that does not fall under the categories mentioned above.
        `),
        type: FieldType.SelectImage,
        validation: yup.array(),
        fieldProps: {
          options: getLandTenureOptions(t),
          multiSelect: true
        }
      },
      {
        name: "proof_of_land_tenure_mou",
        label: t("Please upload any documentation that explains the project area’s land tenure."),
        description: t(
          "If available, upload any documentation that describes the land tenure arrangement in your project area. This can include information collected by your own organization, a government body, or an independent assessment. If you have a memorandum of understanding (MOU) with any communities, the government, or traditional authorities within the proposed project area, you are highly encouraged to upload it. Do not include any documentation that is not related to the proposed project area."
        ),
        type: FieldType.FileUpload,
        validation: yup.array(),
        fieldProps: {
          uuid,
          model: ModelName,
          collection: "proof_of_land_tenure_mou",
          accept: [FileType.Pdf, FileType.Document],
          allowMultiple: true
        }
      },
      {
        name: "landholder_comm_engage",
        label: t("How does the land tenure system operate in your project area?"),
        description: t(
          "Describe in detail how the land tenure system operates within your project area, including any changes that have occurred within the past decade. Outline who owns, leases, and uses the land and any current disputes. Within that context, indicate how you plan to select sites for restoration within your proposed project area, and how you will ensure that this project will not exacerbate inequalities related to land tenure."
        ),
        type: FieldType.TextArea,
        validation: yup.string(),
        fieldProps: {}
      },
      {
        name: "proj_success_risks",
        label: t(
          "What risks could your project will face, and how do you intend to reduce their likelihood and mitigate their effects?"
        ),
        description: t(
          "Describe in detail the specific environmental, social, and economic risks that could jeopardize the success of your project. Identify the steps that you will take to reduce the likelihood of their occurrence. If they were to occur, despite your best planning, what steps does your organization take to lessen the long-term impact of the harmful event after it occurs. Describe the specific risk mitigation policies that your organization has put in place. Restoration is inherently a risky proposition, and this is considered when assessing applications."
        ),
        type: FieldType.TextArea,
        validation: yup.string(),
        fieldProps: {}
      },
      {
        name: "monitor_eval_plan",
        label: t("How would you report on, monitor, and verify the impact of your project?"),
        description: t(
          "Describe how you intend to track and protect the long-term impact of your proposed project through a concrete monitoring and evaluation plan. Indicate the specific metrics that your organization uses to denote “success” and how you intend to gather and assure the quality of the relevant data. Identify what assistance you would need to carry out this plan."
        ),
        type: FieldType.TextArea,
        validation: yup.string(),
        fieldProps: {}
      },
      {
        name: "proj_boundary",
        label: t("Please draw or upload a geospatial polygon of your proposed restoration area."),
        description: t(`
          TerraMatch requires applicants to indicate where they will restore land. If your project is selected for funding, you would be required to precisely identify the locations of each of your restoration sites with a geospatial polygon. At this stage, you must submit the approximate location of your proposed project area. Do not submit the location of one of your past projects.
          <br/><br/>
          TerraMatch has several built-in ways for you to geospatially define your project area:<br/>
          1. Draw your project sites on TerraMatch below; or<br/>
          2. Upload your project's polygon that you have created outside of TerraMatch, please upload it here in one of the following three formats: .geojson, .kml, or .zip (containing .dbf, .shp, .shx and .prj files).
          <br/><br/>
          For more information about how to create a polygon, see <a href="https://terramatchsupport.zendesk.com/hc/en-us/articles/14837545925147#h_01GV6M5YXAF0NAYF7JRNQJR6AT">this</a> guidance.
          <br/><br/>
          For more information about how to create a polygon or to see if your proposed project area fits within the eligible project areas, consult <a href="https://terramatchsupport.zendesk.com/hc/en-us/articles/15160781169691">this article</a>.
        `),
        type: FieldType.Map,
        validation: yup.object(),
        fieldProps: {}
      },
      {
        name: "sustainable_dev_goals",
        label: t("Which Sustainable Development Goals (SDGs) would your project support?"),
        description: t(
          "Select the SDGs that your project will support. Before selecting, consult this webpage to understand the definition of each goal: <a href='https://sdgs.un.org/goals'>https://sdgs.un.org/goals</a>"
        ),
        type: FieldType.Dropdown,
        validation: yup.array(),
        fieldProps: {
          options: sustainableDevelopmentGoalsOptions(t),
          multiSelect: true
        }
      },
      {
        name: "cover",
        type: FieldType.FileUpload,
        label: t("Photo to use as a cover image for this project"),
        description: t("Please upload an image of resolution 1200 x 300px to display on your public pitch page."),
        validation: yup.object(),
        fieldProps: {
          uuid,
          collection: "cover",
          model: ModelName,
          maxFileSize: 10,
          accept: [FileType.Image]
        }
      }
    ]
  },
  {
    title: t("Environmental Impact"),
    fields: [
      {
        name: "expected_active_restoration_start_date",
        label: t("When do you expect to this project to begin actively restoring land?"),
        description: t(
          "Indicate the date when you expect the first preparation activity to occur on one of the project’s restoration sites. This should include the first time that the land is actively improved by the project’s employees or volunteers. This will usually occur during the site preparation phase, after communities are mobilized and sites are selected but before planting or natural regeneration begins. For this opportunity, we expect this to be no earlier than January 2024."
        ),
        type: FieldType.Input,
        validation: yup.string(),
        fieldProps: {
          type: "date"
        }
      },
      {
        name: "expected_active_restoration_end_date",
        label: t("When do you expect this project’s final restoration activity to occur?"),
        description: t(
          "Indicate the date when you expect the last active restoration activity to occur. This usually indicates the date when the last tree will be planted, or the date when the last natural regeneration area will be treated. You should not include years in which only monitoring, maintenance, and evaluation are conducted. "
        ),
        type: FieldType.Input,
        validation: yup.string(),
        fieldProps: {
          type: "date"
        }
      },
      {
        name: "description_of_project_timeline",
        label: t("What are the key stages of this project’s implementation?"),
        description: t(
          "Describe in detail each of the stages of project and when the months and years in which they will occur. These stages can include community mobilization, site preparation, planting, maintenance, and monitoring. You should not propose that additional land be brought under restoration or trees planted in any year after 2025."
        ),
        type: FieldType.TextArea,
        validation: yup.string(),
        fieldProps: {}
      },
      {
        name: "proj_area_description",
        label: t("What are the biophysical characteristics of the project area?"),
        description: t(
          "Describe in detail the physical and biological characteristics of the landscape that you intend to restore. Indicate the flora and fauna species that are common to the area, along with the physical characteristics and precipitation patterns. Provide as many details as necessary to paint a picture of the landscape today. Wherever possible, include figures to illustrate your points."
        ),
        type: FieldType.TextArea,
        validation: yup.string(),
        fieldProps: {}
      },
      {
        name: "main_causes_of_degradation",
        label: t("What are the main causes of degradation in the project area?"),
        description: t(
          "Explain how and why the landscape has been degraded, with a focus on the past 10 years. Describe the impact of degradation on biodiversity and ecosystem services and the specific challenges that it has created for the vitality of the landscape. Wherever possible, include figures to illustrate your points."
        ),
        type: FieldType.TextArea,
        validation: yup.string(),
        fieldProps: {}
      },
      {
        name: "restoration_intervention_types",
        label: t("What interventions do you intend to use to restore land?"),
        description: t(`
          Please indicate which restoration interventions you intend to deploy in this project. If you intend to use multiple different restoration interventions, check all that apply. Please find definitions below: <br/>
          Agroforestry: The intentional mixing and cultivation of woody perennial species (trees, shrubs, bamboos) alongside agricultural crops in a way that improves the agricultural productivity and ecological function of a site. 
          <br/><br/>
          Applied Nucleation: A form of enrichment planting where trees are planted in groups, clusters, or even rows, dispersed throughout an area, to encourage natural regeneration in the matrix between the non-planted areas. 
          <br/><br/>
          Assisted Natural Regeneration: The exclusion of threats (i.e. grazing, fire, invasive plants) that had previously prevented the natural regrowth of a forested area from seeds already present in the soil, or from natural seed dispersal from nearby trees. This does not include any active tree planting. 
          Direct Seeding: The active dispersal of seeds (preferably ecologically diverse, native seed mixes) that will allow for natural regeneration to occur, provided the area is protected from disturbances. This may be done by humans or drones- implies active collection and dispersal, not natural dispersal by natural seed dispersers that is part of natural regeneration processes. 
          <br/><br/>
          Enrichment Planting: The strategic re-establishment of key tree species in a forest that is ecologically degraded due to lack of certain species, without which the forest is unable to naturally sustain itself. 
          <br/><br/>
          Mangrove Restoration: Specific interventions in the hydrological flows and/or vegetative cover to create or enhance the ecological function of a degraded mangrove tree site 
          <br/><br/>
          Reforestation: The planting of seedlings over an area with little or no forest canopy to meet specific goals. 
          <br/><br/>
          Riparian Restoration: Specific interventions in the hydrological flows and vegetative cover to improve the ecological function of a degraded wetland or riparian area. 
          <br/><br/>
          Silvopasture: The intentional mixing and cultivation of woody perennial species (trees, shrubs, bamboos) on pastureland where tree cover was absent in a way that improves the agricultural productivity and ecological function of a site for continued use as pasture.Please indicate which restoration interventions you intend to deploy in this project. If you intend to use multiple different restoration interventions, check all that apply.
        `),
        type: FieldType.Dropdown,
        validation: yup.array(),
        fieldProps: {
          options: getRestorationInterventionTypeOptions(t),
          multiSelect: true
        }
      },
      {
        name: "total_hectares",
        label: t("How many hectares of land do you intend to restore through this project?"),
        description: t(
          "A hectare of land restored is defined as the total land area measured in hectares that has undergone restoration intervention. The land area under restoration includes more than active tree planting. Some land may not be planted while undergoing restoration. Instead, trees could be naturally regenerated on that land could without active planting. Only count land that has benefitted from tree-based restoration techniques in your total."
        ),
        type: FieldType.Input,
        validation: yup.number(),
        fieldProps: { type: "number" }
      },
      {
        name: "total_trees",
        label: t("How many trees do you intend to restore through this project?"),
        description: t(`
          A tree is defined as a woody perennial plant, typically having a single stem or trunk growing to 5 meters or higher, bearing lateral branches at some distance from the ground. 
          <br/>
          TerraMatch counts "trees restored," not "planted" Only trees that survive to maturity after they are planted or naturally regenerated should be counted toward this total. Naturally regenerating trees must attain a verifiable age of over 1 year to be counted as "restored."
        `),
        type: FieldType.Input,
        validation: yup.number(),
        fieldProps: { type: "number" }
      },
      {
        name: "tree_species",
        label: t("What tree species do you intend to grow through this project?"),
        description: t(
          "List the species and the estimated number of trees that you intend to plant using the form below. The scientific names of each species are preferred. Please be precise."
        ),
        type: FieldType.TreeSpecies,
        validation: yup.array(
          yup.object({
            name: yup.string(),
            amount: yup.string().required()
          })
        ),
        fieldProps: {
          title: t("Tree Species"),
          buttonCaptionSuffix: t("Species"),
          uuid,
          model: "project-pitch",
          withNumbers: true
        }
      },
      {
        name: "proposed_num_sites",
        label: t("How many geographically separate locations would your project restore?"),
        description: t(
          "Identify the approximate number of geographically separate locations where restoration activities will take place. If you work with hundreds of individual smallholder farmers, for example, please provide your best, rounded guess. This preliminary information is important to help us understand how to support your organization if you are selected and are required to create precise geospatial polygons of your restoration sites."
        ),
        type: FieldType.Input,
        validation: yup.number(),
        fieldProps: { type: "number" }
      },

      {
        name: "environmental_goals",
        label: t("What would be the ecological benefits of your project?"),
        description: t(
          "Describe in detail the projected how this proposed project would restore the landscape’s ecosystem services and biodiversity, focusing on the degradation that you highlighted above. Specify how the project’s proposed tree species and restoration interventions would lead to the desired change. Wherever possible, include figures to illustrate your points."
        ),
        type: FieldType.TextArea,
        validation: yup.string(),
        fieldProps: {}
      },

      {
        name: "seedlings_source",
        label: t("What would be the sources of tree seedlings for your project?"),
        description: t(
          "Describe how your proposed project would source the seedlings used to restore your restoration sites. If you know the names of specific nurseries or seedling producers, such as government agencies, include them in your response.<br/>If you plan to include natural regeneration in your proposal, describe the state of the existing root stock in the project area."
        ),
        type: FieldType.TextArea,
        validation: yup.string(),
        fieldProps: {}
      },
      {
        name: "proposed_num_nurseries",
        label: t("How many tree nurseries would this project establish or expand?"),
        description: t(
          "Indicate the approximate number of tree nurseries that your proposed project would establish or expand. Include only nurseries that your organization or an affiliated community group operates. If you source seedlings from any government-run or privately operated nurseries, do not include them in this tally."
        ),
        type: FieldType.Input,
        validation: yup.number().max(9999999),
        fieldProps: { type: "number" }
      }
    ]
  },
  {
    title: t("Social Impact"),
    fields: [
      {
        name: "curr_land_degradation",
        label: t("How has land degradation impacted the livelihoods of the communities living in the project area?"),
        description: t(
          "Explain how the degradation of the landscape that you described earlier has affected the livelihoods of local people, including their crop yields, income, health, and education. Wherever possible, include figures to illustrate your points."
        ),
        type: FieldType.TextArea,
        validation: yup.string(),
        fieldProps: {}
      },
      {
        name: "proj_impact_socieconom",
        label: t("How would restoring the project area improve the livelihoods of local people and their communities?"),
        description: t(
          `Describe in detail how this proposed project would restore economic vitality to local communities. Specify how the project’s proposed tree species and restoration interventions would lead to the desired change. Include information about the supply chains or value chains that your project would improve and the steps that the project would take to support local livelihoods over the next 20 years. Wherever possible, include figures to illustrate your points and explain how your project would affect each relevant demographic category of people, such as women and youth. If you differentiate between “direct” and “indirect” beneficiaries, define each of those terms. `
        ),
        type: FieldType.TextArea,
        validation: yup.string(),
        fieldProps: {}
      },
      {
        name: "proj_impact_foodsec",
        label: t("How would the project impact local food security?"),
        description: t(`
          Identify the specific ways that this proposed project would affect the provision, availability, or quality of food in the landscape. For more information, follow <a href="https://terramatchsupport.zendesk.com/knowledge/articles/14837599179419/en-us?brand_id=12511322362267">this</a> link.
          <br/>
          If your project has no direct food security impact, answer with “No direct impact.” It is understood that some restoration projects do not directly improve food security.
        `),
        type: FieldType.TextArea,
        validation: yup.string(),
        fieldProps: {}
      },
      {
        name: "proj_impact_watersec",
        label: t(
          "Are there any connections between the proposed project and improved water availability, quality, or flow? If so, please describe:"
        ),
        description: t(`
          Identify the specific ways that this proposed project would affect water quantity, quality, stability, or accessibility in the landscape. For more information, follow <a href="https://terramatchsupport.zendesk.com/hc/en-us/articles/14837599179419">this</a> link.<br/>
          If your proposed project has no direct impact on improving local hydrological conditions, answer with “No direct impact.” It is understood that some restoration projects may not directly improve hydrological conditions or may be difficult to assess.
        `),
        type: FieldType.TextArea,
        validation: yup.string(),
        fieldProps: {}
      },
      {
        name: "proj_impact_jobtypes",
        label: t("What kind of new jobs would this project create?"),
        description: t(`
          Restoration projects require many different skills, from nursery management to monitoring and evaluation. Describe the types of paid jobs that this project would create, how employees would be compensated, and what safeguards would be put in place to ensure that workers are protected. You are encouraged to explain how this project would create lasting jobs in the landscape.<br/>
          TerraMatch expects its partners to abide by the principles of ethical engagement and employment to ensure fair compensation, prevent land grabbing and the use of coercion for accessing land, exclude forced labor and child labor in their operations, and prevent harassment, including sexual harassment.        
        `),
        type: FieldType.TextArea,
        validation: yup.string(),
        fieldProps: {}
      },
      {
        name: "num_jobs_created",
        label: t("How many new paid jobs would your proposed project create?"),
        description: t(
          `A “job” is defined as a person aged 18 years or older who has worked for pay, profit, or benefit for at least one hour during a given week. In this tally, include all proposed full-time and part-time jobs that would work directly on this project and that your organization would pay. Do not include volunteers or project beneficiaries that are not paid directly by your organization.`
        ),
        type: FieldType.Input,
        validation: yup.number(),
        fieldProps: {
          type: "number"
        }
      },
      {
        name: "pct_employees",
        label: t("What is the breakdown of new paid jobs your proposed project will create?"),
        description: t(`
          Estimate the percentage of the total jobs that will be full-time, part-time, held by women, and held by people between and including the ages of 18 and 35. Note that TerraMatch does not support projects that directly employ people under 18 years of age.<br/>
          To access more comprehensive definitions of each of these categories, consult <a href="https://terramatchsupport.zendesk.com/knowledge/articles/14837599179419/en-us?brand_id=12511322362267">this</a> page.
        `),
        type: FieldType.InputTable,
        validation: yup.object(),
        fieldProps: {
          headers: ["Jobs", "Count"],
          rows: [
            {
              name: "pct_employees_men",
              label: t("% of total employees that would be men"),
              type: FieldType.Input,
              validation: yup.number().min(0).max(100),
              fieldProps: { type: "number" }
            },
            {
              name: "pct_employees_women",
              label: t("% of total employees that would be women"),
              type: FieldType.Input,
              validation: yup.number().min(0).max(100),
              fieldProps: { type: "number" }
            },
            {
              name: "pct_employees_18to35",
              label: t("% of total employees that would be between the ages of 18 and 35"),
              type: FieldType.Input,
              validation: yup.number().min(0).max(100),
              fieldProps: { type: "number" }
            },
            {
              name: "pct_employees_older35",
              label: t("% of total employees that would be older than 35 years of age"),
              type: FieldType.Input,
              validation: yup.number().min(0).max(100),
              fieldProps: { type: "number" }
            }
          ]
        }
      },
      {
        name: "proj_beneficiaries",
        label: t("How many people would this project benefit?"),
        description: t(
          `A “beneficiary” is defined as anyone who would derive a direct or indirect benefit from your proposed project, excluding your organization’s employees.`
        ),
        type: FieldType.Input,
        validation: yup.number(),
        fieldProps: {
          type: "number"
        }
      },
      {
        name: "pct_beneficiaries",
        label: t("What is the breakdown of people that this project would benefit?"),
        description: t(`
          Estimate the percentage of the total beneficiaries that are women, younger than 35 years of age, smallholder farmers and large-scale farmers. TerraMatch does not support jobs destined for people under 18 years old.<br/>
          Smallholder farmers operate on less than 2 hectares of land. Large-scale farmers operate on more than 2 hectares of land.
        `),
        type: FieldType.InputTable,
        validation: yup.object(),
        fieldProps: {
          headers: ["Beneficiary Type", "Beneficiary Count"],
          rows: [
            {
              name: "pct_beneficiaries_women",
              label: t("% of project beneficiaries that would be women"),
              type: FieldType.Input,
              validation: yup.number().min(0).max(100),
              fieldProps: { type: "number" }
            },
            {
              name: "pct_beneficiaries_small",
              label: t("% of project beneficiaries that would be smallholder farmers"),
              type: FieldType.Input,
              validation: yup.number().min(0).max(100),
              fieldProps: { type: "number" }
            },
            {
              name: "pct_beneficiaries_large",
              label: t("% of project beneficiaries that would be large-scale farmers"),
              type: FieldType.Input,
              validation: yup.number().min(0).max(100),
              fieldProps: { type: "number" }
            },
            {
              name: "pct_beneficiaries_youth",
              label: t("% of project beneficiaries that would be be younger than 35 years old"),
              type: FieldType.Input,
              validation: yup.number().min(0).max(100),
              fieldProps: { type: "number" }
            }
          ]
        }
      }
    ]
  },
  {
    title: t("Additional Information"),
    fields: [
      {
        name: "additional",
        type: FieldType.FileUpload,
        label: t("Upload any additional documents"),
        validation: yup.array(),
        fieldProps: {
          uuid,
          collection: "additional",
          model: ModelName,
          allowMultiple: true,
          maxFileSize: 5,
          accept: [FileType.ImagesAndDocs]
        }
      },
      {
        name: "capacity_building_needs",
        label: t("On which of the following topics would you request technical assistance from a team of experts?"),
        description: t(
          `Please select as many as apply. Note that this information remains private. Definitions for each topic can be found <a href="https://terramatchsupport.zendesk.com/hc/en-us/sections/13162666535835-EOI-Resources">here<a/>.`
        ),
        type: FieldType.Dropdown,
        validation: yup.array(),
        fieldProps: {
          options: getCapacityBuildingNeedOptions(t),
          multiSelect: true
        }
      },
      {
        name: "how_discovered",
        label: t("How did you hear about this opportunity on TerraMatch?"),
        description: t("Please select all that apply. If you heard about us from another source, please select other."),
        type: FieldType.Dropdown,
        validation: yup.array(),
        fieldProps: {
          options: getMarketingReferenceOptions(t),
          multiSelect: true
        }
      }
    ]
  }
];
