import type { SiteIndexSite, SiteIndexStatus } from "./siteIndex.types";

const SUBMITTABLE_STATUSES: ReadonlySet<SiteIndexStatus> = new Set(["draft", "information-required"]);

export const isSiteSubmittable = (site: SiteIndexSite): boolean => SUBMITTABLE_STATUSES.has(site.status);

export const isSiteDeletable = (site: SiteIndexSite): boolean => site.status === "draft";

export const isSiteEditable = (site: SiteIndexSite): boolean =>
  site.status !== "pending-approval" && site.update !== "pending-approval";
