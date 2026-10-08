import type { SiteIndexSite, SiteIndexStatus } from "./siteIndex.types";

type Translate = (key: string, params?: Record<string, unknown>) => string;

const SUBMITTABLE_STATUSES: ReadonlySet<SiteIndexStatus> = new Set(["draft", "information-required"]);

export type SiteSubmitBlockingReason = "approved" | "submitted";

const SUBMIT_BLOCKED_STATUSES: Partial<Record<SiteIndexStatus, SiteSubmitBlockingReason>> = {
  approved: "approved",
  "pending-approval": "submitted"
};

export const isSiteSubmittable = (site: SiteIndexSite): boolean => SUBMITTABLE_STATUSES.has(site.status);

export const isSiteDeletable = (site: SiteIndexSite): boolean => site.status === "draft";

export const isSiteEditable = (site: SiteIndexSite): boolean =>
  site.status !== "pending-approval" && site.update !== "pending-approval";

export const getSiteSubmitBlockingReason = (site: SiteIndexSite): SiteSubmitBlockingReason | null =>
  SUBMIT_BLOCKED_STATUSES[site.status] ?? null;

export const getSiteIndexSubmitTooltip = (sites: SiteIndexSite[], t: Translate): string | string[] | undefined => {
  if (sites.length === 0 || sites.every(isSiteSubmittable)) {
    return undefined;
  }

  const blockingReasons = new Set(
    sites.map(getSiteSubmitBlockingReason).filter((reason): reason is SiteSubmitBlockingReason => reason != null)
  );
  const hasEligibleSelection = sites.some(isSiteSubmittable);

  if (hasEligibleSelection || blockingReasons.size > 1) {
    return [
      t("One or more selected profile can't be submitted because"),
      t("they are already approved or awaiting approval")
    ];
  }

  if (blockingReasons.has("approved")) {
    return t("This profile has already been approved");
  }

  return t("This profile has already been submitted for review");
};
