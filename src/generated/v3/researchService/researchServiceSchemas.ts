/**
 * Generated by @openapi-codegen
 *
 * @version 1.0
 */
export type IndicatorTreeCoverLossDto = {
  indicatorSlug: "treeCoverLoss" | "treeCoverLossFires";
  /**
   * @example 2024
   */
  yearOfAnalysis: number;
  /**
   * Mapping of year of analysis to value.
   *
   * @example {"2023":"0.5","2024":"0.6"}
   */
  value: Record<string, any>;
};

export type IndicatorHectaresDto = {
  indicatorSlug: "restorationByEcoRegion" | "restorationByStrategy" | "restorationByLandUse";
  /**
   * @example 2024
   */
  yearOfAnalysis: number;
  /**
   * Mapping of area type (eco region, land use, etc) to hectares
   *
   * @example {"Northern Acacia-Commiphora bushlands and thickets":0.104}
   */
  value: Record<string, any>;
};

export type IndicatorTreeCountDto = {
  indicatorSlug: "treeCount" | "earlyTreeVerification";
  /**
   * @example 2024
   */
  yearOfAnalysis: number;
  surveyType: string;
  surveyId: number;
  treeCount: number;
  /**
   * @example types TBD
   */
  uncertaintyType: string;
  imagerySource: string;
  imageryId: string;
  projectPhase: string;
  confidence: number;
};

export type IndicatorTreeCoverDto = {
  indicatorSlug: "treeCover";
  /**
   * @example 2024
   */
  yearOfAnalysis: number;
  /**
   * @example 2024
   */
  projectPhase: string;
  percentCover: number;
  plusMinusPercent: number;
};

export type IndicatorFieldMonitoringDto = {
  indicatorSlug: "fieldMonitoring";
  /**
   * @example 2024
   */
  yearOfAnalysis: number;
  treeCount: number;
  projectPhase: string;
  species: string;
  survivalRate: number;
};

export type IndicatorMsuCarbonDto = {
  indicatorSlug: "msuCarbon";
  /**
   * @example 2024
   */
  yearOfAnalysis: number;
  carbonOutput: number;
  projectPhase: string;
  confidence: number;
};

export type TreeSpeciesDto = {
  /**
   * @example Acacia binervia
   */
  name: string;
  /**
   * @example 15000
   */
  amount: number | null;
};

export type ReportingPeriodDto = {
  /**
   * @format date-time
   */
  dueAt: string;
  /**
   * @format date-time
   */
  submittedAt: string;
  /**
   * The tree species reported as planted during this reporting period
   */
  treeSpecies: TreeSpeciesDto[];
};

export type SitePolygonFullDto = {
  /**
   * Indicates if this resource has the full resource definition.
   */
  lightResource: boolean;
  name: string;
  status: "draft" | "submitted" | "needs-more-information" | "approved";
  /**
   * If this ID points to a deleted site, the indicators will be empty.
   */
  siteId: string;
  /**
   * @format date-time
   */
  plantStart: string | null;
  calcArea: number | null;
  /**
   * All indicators currently recorded for this site polygon
   */
  indicators: (
    | IndicatorTreeCoverLossDto
    | IndicatorHectaresDto
    | IndicatorTreeCountDto
    | IndicatorTreeCoverDto
    | IndicatorFieldMonitoringDto
    | IndicatorMsuCarbonDto
  )[];
  /**
   * The name of the associated Site.
   */
  siteName: string;
  /**
   * @format date-time
   */
  plantEnd: string | null;
  geometry: Record<string, any>;
  practice: string | null;
  targetSys: string | null;
  distr: string | null;
  numTrees: number | null;
  /**
   * The tree species associated with the establishment of the site that this polygon relates to.
   */
  establishmentTreeSpecies: TreeSpeciesDto[];
  /**
   * Access to reported trees planted for each approved report on this site.
   */
  reportingPeriods: ReportingPeriodDto[];
};

export type SitePolygonLightDto = {
  /**
   * Indicates if this resource has the full resource definition.
   */
  lightResource: boolean;
  name: string;
  status: "draft" | "submitted" | "needs-more-information" | "approved";
  /**
   * If this ID points to a deleted site, the indicators will be empty.
   */
  siteId: string;
  /**
   * @format date-time
   */
  plantStart: string | null;
  calcArea: number | null;
  /**
   * All indicators currently recorded for this site polygon
   */
  indicators: (
    | IndicatorTreeCoverLossDto
    | IndicatorHectaresDto
    | IndicatorTreeCountDto
    | IndicatorTreeCoverDto
    | IndicatorFieldMonitoringDto
    | IndicatorMsuCarbonDto
  )[];
  /**
   * The name of the associated Site.
   */
  siteName: string;
};

export type SitePolygonUpdateAttributes = {
  /**
   * All indicators to update for this polygon
   */
  indicators: (
    | IndicatorTreeCoverLossDto
    | IndicatorHectaresDto
    | IndicatorTreeCountDto
    | IndicatorTreeCoverDto
    | IndicatorFieldMonitoringDto
    | IndicatorMsuCarbonDto
  )[];
};

export type SitePolygonUpdate = {
  type: "sitePolygons";
  /**
   * @format uuid
   */
  id: string;
  attributes: SitePolygonUpdateAttributes;
};

export type SitePolygonBulkUpdateBodyDto = {
  data: SitePolygonUpdate[];
};
