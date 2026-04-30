export type SitePolygon = {
  id?: number;
  uuid?: string;
  primary_uuid?: string;
  project_id?: string;
  proj_name?: string;
  org_name?: string;
  poly_id?: string;
  poly_name?: string;
  site_id?: string;
  site_name?: string;
  /**
   * @format date
   */
  plantstart?: string;
  practice?: string;
  target_sys?: string;
  distr?: string;
  num_trees?: number;
  /**
   * @format float
   */
  calc_area?: number;
  created_by?: string;
  last_modified_by?: string;
  /**
   * @format date-time
   */
  deleted_at?: string;
  /**
   * @format date-time
   */
  created_at?: string;
  /**
   * @format date-time
   */
  updated_at?: string;
  status?: string;
  source?: string;
  country?: string;
  is_active?: boolean;
  version_name?: string;
  validation_status?: boolean;
};
