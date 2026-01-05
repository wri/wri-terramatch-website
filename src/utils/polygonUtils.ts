import { SitePolygon } from "@/generated/apiSchemas";

export const getSiteIdFromPolyVersion = (polyVersion: SitePolygon | undefined): string | null => {
  if (polyVersion == null) return null;
  return (
    (polyVersion as { siteId?: string; site_id?: string }).siteId ??
    (polyVersion as { siteId?: string; site_id?: string }).site_id ??
    null
  );
};

export const getPolygonUuidFromPolyVersion = (polyVersion: SitePolygon | undefined): string | null => {
  if (polyVersion == null) return null;
  return (
    (polyVersion as { polygonUuid?: string; poly_id?: string }).polygonUuid ??
    (polyVersion as { polygonUuid?: string; poly_id?: string }).poly_id ??
    null
  );
};

export const getNameFromPolyVersion = (polyVersion: SitePolygon | undefined): string | null => {
  if (polyVersion == null) return null;
  return (
    (polyVersion as { name?: string; poly_name?: string }).name ??
    (polyVersion as { name?: string; poly_name?: string }).poly_name ??
    null
  );
};
