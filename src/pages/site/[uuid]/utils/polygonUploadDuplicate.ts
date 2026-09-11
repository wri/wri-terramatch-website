const DUPLICATE_GEOMETRY_CRITERIA_ID = 16;

export type DuplicatePolygonUploadInfo = {
  sitePolygonUuid: string;
  polygonUuid: string;
  siteUuid: string;
  siteName: string;
  sitePolygonName?: string;
};

type UploadDataResource = {
  type?: string;
  id?: string;
  attributes?: {
    siteId?: string | null;
    siteName?: string | null;
    polygonUuid?: string | null;
    name?: string | null;
  };
};

type UploadValidationIncluded = {
  type?: string;
  id?: string;
  attributes?: {
    polygonUuid?: string;
    criteriaList?: Array<{
      criteriaId?: number;
      validationType?: string;
      valid?: boolean;
      extraInfo?: Record<string, unknown>;
    }>;
  };
};

type LooseUploadResource = UploadDataResource | UploadValidationIncluded;

type LooseUploadResponse = {
  meta?: { resourceType?: string };
  data?: LooseUploadResource | LooseUploadResource[];
  included?: LooseUploadResource[];
};

const asNonEmptyString = (value: unknown): string | null =>
  typeof value === "string" && value.length > 0 ? value : null;

const normalizeResources = (data: LooseUploadResponse["data"]): LooseUploadResource[] => {
  if (data == null) {
    return [];
  }

  return Array.isArray(data) ? data : [data];
};

const isSitePolygonResource = (resource: LooseUploadResource): resource is UploadDataResource =>
  resource.type == null || resource.type === "sitePolygons";

const isValidationResource = (resource: LooseUploadResource): resource is UploadValidationIncluded =>
  resource.type === "validations";

const extractDuplicateInfos = (
  included: UploadValidationIncluded[],
  dataResources: UploadDataResource[]
): DuplicatePolygonUploadInfo[] => {
  const dataBySitePolygonUuid = new Map(
    dataResources
      .filter(resource => resource.id != null && resource.id !== "")
      .map(resource => [resource.id!, resource])
  );
  const dataByPolygonUuid = new Map(
    dataResources
      .filter(resource => asNonEmptyString(resource.attributes?.polygonUuid) != null)
      .map(resource => [resource.attributes!.polygonUuid!, resource])
  );

  const duplicates: DuplicatePolygonUploadInfo[] = [];

  for (const item of included) {
    for (const criteria of item.attributes?.criteriaList ?? []) {
      const isDuplicate =
        criteria.valid === false &&
        (criteria.validationType === "DUPLICATE_GEOMETRY" || criteria.criteriaId === DUPLICATE_GEOMETRY_CRITERIA_ID);
      if (!isDuplicate) {
        continue;
      }

      const extraInfo = criteria.extraInfo ?? {};
      const polygonUuid =
        asNonEmptyString(extraInfo.polygonUuid) ??
        asNonEmptyString(item.attributes?.polygonUuid) ??
        asNonEmptyString(item.id);
      if (polygonUuid == null) {
        continue;
      }

      const matchedBySitePolygonUuid = asNonEmptyString(extraInfo.sitePolygonUuid);
      const matchedResource =
        (matchedBySitePolygonUuid != null ? dataBySitePolygonUuid.get(matchedBySitePolygonUuid) : undefined) ??
        dataByPolygonUuid.get(polygonUuid);

      const sitePolygonUuid =
        matchedBySitePolygonUuid ??
        asNonEmptyString(matchedResource?.id) ??
        asNonEmptyString(extraInfo.sitePolygonUuid);
      if (sitePolygonUuid == null) {
        continue;
      }

      const siteUuid =
        asNonEmptyString(extraInfo.siteUuid) ?? asNonEmptyString(matchedResource?.attributes?.siteId) ?? "";
      const siteName =
        asNonEmptyString(extraInfo.siteName) ?? asNonEmptyString(matchedResource?.attributes?.siteName) ?? "";
      const sitePolygonName =
        asNonEmptyString(extraInfo.sitePolygonName) ?? asNonEmptyString(matchedResource?.attributes?.name) ?? undefined;

      duplicates.push({
        sitePolygonUuid,
        polygonUuid,
        siteUuid,
        siteName,
        sitePolygonName
      });
    }
  }

  return duplicates;
};

export const extractPureDuplicateFromUploadResponse = (response: unknown): DuplicatePolygonUploadInfo | null => {
  const payload = response as LooseUploadResponse;
  const allResources = [...normalizeResources(payload.data), ...normalizeResources(payload.included)];
  const dataResources = allResources.filter(isSitePolygonResource);
  const validationResources = allResources.filter(isValidationResource);
  const resourceType = payload.meta?.resourceType ?? dataResources[0]?.type;
  if (resourceType !== "sitePolygons" && dataResources.length === 0) {
    return null;
  }

  const duplicates = extractDuplicateInfos(validationResources, dataResources);
  if (duplicates.length === 0 || dataResources.length === 0) {
    return null;
  }

  const duplicateSitePolygonUuids = new Set(duplicates.map(duplicate => duplicate.sitePolygonUuid));
  const allDataAreDuplicates = dataResources.every(
    resource => resource.id != null && resource.id !== "" && duplicateSitePolygonUuids.has(resource.id)
  );
  if (!allDataAreDuplicates) {
    return null;
  }

  return duplicates[0] ?? null;
};
