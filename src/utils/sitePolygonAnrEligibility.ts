import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

export const ANR_MONITORING_PLOTS_REQUIRED_PRACTICE = "assisted-natural-regeneration";

export type SitePolygonAnrEligibilityInput = Pick<SitePolygonLightDto, "status" | "practice">;

export function isSitePolygonEligibleForAnrMonitoringPlots(
  sitePolygon: SitePolygonAnrEligibilityInput | null | undefined
): boolean {
  if (sitePolygon == null) {
    return false;
  }
  if (sitePolygon.status !== "approved") {
    return false;
  }
  return (sitePolygon.practice ?? []).includes(ANR_MONITORING_PLOTS_REQUIRED_PRACTICE);
}
