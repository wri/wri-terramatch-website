/**
 * Generated by @openapi-codegen
 *
 * @version 1.0.0
 */
export type PutV2AdminUpdateRequestsUuidStatusBody = {
  feedback?: string;
  feedback_fields?: string[];
};

export type V2PostOrganisationsApproveUserBody = {
  organisation_uuid: string;
  user_uuid: string;
};

export type PatchV2AuthVerifyBody = {
  token?: string;
};

export type Body = {
  id?: number;
  uuid?: string;
  poly_name?: string;
  /**
   * @format date
   */
  plantstart?: string;
  /**
   * @format date
   */
  plantend?: string;
  practice?: string;
  target_sys?: string;
  distr?: string;
  num_trees?: number;
  /**
   * @format float
   */
  calc_area?: number;
  status?: string;
};

export type PutV2AdminSitesUuid = {
  status?: string;
  comment?: string;
};

export type PostV2FundingProgrammeBody = {
  name?: string;
  description?: string;
  read_more_url?: string;
  location?: string;
  organisation_types?: string[];
  cover?: {
    uuid?: string;
    url?: string;
    thumb_url?: string;
    collection_name?: string;
    title?: string;
    file_name?: string;
    mime_type?: string;
    size?: number;
    lat?: number;
    lng?: number;
    is_public?: boolean;
    created_at?: string;
  };
  status?: string;
};

export type PostV2FormsEntityFormUuidBody = {
  /**
   * allowed values projects/sites/nurseries/project-reports/site-reports/nursery-reports
   */
  parent_entity?: string;
  parent_uuid?: string;
  form_uuid?: string;
};

export type V2PostOrganisationsBody = {
  /**
   * Available type are for-profit-organization, non-profit-organization, government-agency
   */
  type?: string;
  private?: boolean;
  name?: string;
  phone?: string;
  currency?: string;
  states?: string[];
  loan_status_types?: string[];
  land_systems?: string[];
  fund_utilisation?: string[];
  detailed_intervention_types?: string[];
  community_members_engaged_3yr?: number;
  community_members_engaged_3yr_women?: number;
  community_members_engaged_3yr_men?: number;
  community_members_engaged_3yr_youth?: number;
  community_members_engaged_3yr_non_youth?: number;
  community_members_engaged_3yr_smallholder?: number;
  community_members_engaged_3yr_backward_class?: number;
  total_board_members?: number;
  pct_board_women?: number;
  pct_board_men?: number;
  pct_board_youth?: number;
  pct_board_non_youth?: number;
  account_number_1?: string;
  account_number_2?: string;
  approach_of_marginalized_communities?: string;
  community_engagement_numbers_marginalized?: string;
  founding_date?: string;
  description?: string;
  leadership_team?: string;
  countries?: string[];
  engagement_farmers?: string[];
  engagement_women?: string[];
  engagement_youth?: string[];
  engagement_non_youth?: string[];
  tree_restoration_practices?: string[];
  business_model?: string;
  subtype?: string;
  organisation_revenue_this_year?: number;
  languages?: string[];
  web_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  hq_street_1?: string;
  hq_street_2?: string;
  hq_city?: string;
  hq_state?: string;
  hq_zipcode?: string;
  hq_country?: string;
  fin_start_month?: number;
  /**
   * @format float
   */
  fin_budget_3year?: number;
  /**
   * @format float
   */
  fin_budget_2year?: number;
  /**
   * @format float
   */
  fin_budget_1year?: number;
  /**
   * @format float
   */
  fin_budget_current_year?: number;
  /**
   * @format float
   */
  ha_restored_total?: number;
  /**
   * @format float
   */
  ha_restored_3year?: number;
  relevant_experience_years?: number;
  trees_grown_total?: number;
  trees_grown_3year?: number;
  tree_care_approach?: string;
  ft_permanent_employees?: number;
  pt_permanent_employees?: number;
  temp_employees?: number;
  female_employees?: number;
  male_employees?: number;
  young_employees?: number;
  additional_funding_details?: string;
  community_experience?: string;
  total_engaged_community_members_3yr?: number;
  percent_engaged_women_3yr?: number;
  percent_engaged_men_3yr?: number;
  percent_engaged_under_35_3yr?: number;
  percent_engaged_over_35_3yr?: number;
  percent_engaged_smallholder_3yr?: number;
  total_trees_grown?: number;
  avg_tree_survival_rate?: number;
  tree_maintenance_aftercare_approach?: string;
  restored_areas_description?: string;
  monitoring_evaluation_experience?: string;
  funding_history?: string;
  shapefiles?: {
    uuid?: string;
    shapefileable_type?: string;
    shapefileable_id?: number;
    geojson?: string;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
  }[];
  tags?: string[];
};

export type PostV2SitesUuidGeometryBody = {
  geometries?: {
    type?: "FeatureCollection";
    features?: {
      type?: "Feature";
      properties?: {
        poly_name?: string;
        /**
         * @format date
         */
        plantstart?: string;
        /**
         * @format date
         */
        plantend?: string;
        practice?: string;
        target_sys?: string;
        distr?: string;
        num_trees?: number;
        site_id?: string;
      };
      geometry?: {
        type?: "Polygon";
        coordinates?: number[][][];
      };
    }[];
  }[];
};

export type V2AdminOrganisationApproveBody = {
  uuid: string;
};

export type GetV2AdminNurseryReportsBody = {
  /**
   * search term to use on the collection
   */
  search?: string;
  /**
   * multiple filters can be applied. syntax is ?filter[foo]=value1,value2$filter[bar]=value3
   */
  filter?: string;
  /**
   * sorting can be applied, default is ascending or use - for descending. For Example ?sort=-name
   */
  sort?: string;
  /**
   * number of results (per page) to return
   */
  per_page?: number;
  /**
   * page number you want results from
   */
  page?: number;
};

export type PostV2AdminFundingProgrammeStageBody = {
  name?: string;
  funding_programme_id?: number;
  form_id?: string;
  deadline_at?: string;
  order?: number;
};

export type GetV2FundingProgrammeIDBody = {
  id?: number;
  uuid?: string;
  name?: string;
  description?: string;
  location?: string;
  read_more_url?: string;
  framework_key?: string;
  status?: string;
  organisation_types?: string[];
  stages?: {
    id?: number;
    uuid?: string;
    status?: string;
    deadline_at?: string;
    readable_status?: string;
    funding_programme_id?: number;
    name?: string;
    order?: number;
    forms?: {
      id?: number;
      uuid?: string;
      type?: string;
      version?: number;
      title?: string;
      subtitle?: string;
      description?: string;
      framework_key?: string;
      duration?: string;
      deadline_at?: string;
      documentation?: string;
      documentation_label?: string;
      submission_message?: string;
      published?: boolean;
      stage_id?: string;
      options_other?: boolean;
      form_sections?: {
        order?: number;
        form_id?: number;
        form_questions?: {
          id?: number;
          uuid?: string;
          form_section_id?: number;
          label?: string;
          validation?: string[];
          parent_id?: string;
          linked_field_key?: string;
          children?: Record<string, any>[];
          multichoice?: boolean;
          order?: number;
          options?: {
            id?: number;
            uuid?: string;
            form_question_id?: number;
            label?: string;
            order?: number;
            created_at?: string;
            updated_at?: string;
            deleted_at?: string;
          }[];
          table_headers?: {
            id?: number;
            uuid?: string;
            form_question_id?: number;
            label?: string;
            order?: number;
            created_at?: string;
            updated_at?: string;
            deleted_at?: string;
          }[];
          additional_text?: string;
          additional_url?: string;
          show_on_parent_condition?: boolean;
          input_type?:
            | "date"
            | "text"
            | "long-text"
            | "select"
            | "checkboxes"
            | "radio"
            | "number"
            | "image"
            | "file"
            | "conditional";
          created_at?: string;
          updated_at?: string;
          deleted_at?: string;
        }[];
        created_at?: string;
        updated_at?: string;
        deleted_at?: string;
      }[];
      /**
       * this is a list of key value pairs eg. slug: name
       */
      tags?: string[];
      updated_by?: number;
      deleted_at?: string;
      created_at?: string;
      updated_at?: string;
    };
    deleted_at?: string;
    created_at?: string;
    updated_at?: string;
  }[];
  organisations?: {
    uuid?: string;
    name?: string;
  }[];
  cover?: {
    uuid?: string;
    url?: string;
    thumb_url?: string;
    collection_name?: string;
    title?: string;
    file_name?: string;
    mime_type?: string;
    size?: number;
    lat?: number;
    lng?: number;
    is_public?: boolean;
    created_at?: string;
  };
  deleted_at?: string;
  created_at?: string;
  updated_at?: string;
};

export type PostV2AuditStatus = {
  entity?: string;
  entity_uuid?: string;
  status?: string;
  comment?: string;
  /**
   * @format date
   */
  date_created?: string;
  created_by?: string;
  is_active?: boolean;
  is_submitted?: boolean;
  type?: string;
  first_name?: string;
  last_name?: string;
  request_removed?: boolean;
};
