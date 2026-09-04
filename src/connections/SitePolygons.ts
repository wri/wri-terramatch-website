import { isEmpty } from "lodash";
import { useCallback, useEffect, useState } from "react";

import { pruneBoundingBoxesCache } from "@/connections/BoundingBox";
import { loadListPolygonVersions } from "@/connections/PolygonVersion";
import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import type { AuditStatusDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  type UpdateSitePolygonStatusResponse,
  bulkDeleteSitePolygons as bulkDeleteSitePolygonsEndpoint,
  bulkUpdateSitePolygonAttributes as bulkUpdateSitePolygonAttributesEndpoint,
  createSitePolygons,
  deleteSitePolygon as deleteSitePolygonEndpoint,
  sitePolygonsIndex,
  SitePolygonsIndexQueryParams,
  updateSitePolygonStatus
} from "@/generated/v3/researchService/researchServiceComponents";
import type {
  AttributeChangesDto,
  CreateSitePolygonAttributesDto,
  SitePolygonBulkAttributeChangesDto,
  SitePolygonBulkAttributeUpdateBodyDto,
  SitePolygonBulkDeleteBodyDto,
  SitePolygonLightDto,
  SitePolygonStatusBulkUpdateBodyDto
} from "@/generated/v3/researchService/researchServiceSchemas";
import { resolveUrl } from "@/generated/v3/utils";
import { useStableProps } from "@/hooks/useStableProps";
import ApiSlice, { type JsonApiResource, PendingError } from "@/store/apiSlice";
import { ConnectionProps, Filter } from "@/types/connection";
import { loadConnection } from "@/utils/loadConnection";

const ALL_POLYGONS_PAGE_SIZE = 100;

export type Indicator = Required<SitePolygonsIndexQueryParams>["presentIndicator[]"] extends Array<infer T> ? T : never;
export type PolygonStatus = Required<SitePolygonsIndexQueryParams>["polygonStatus[]"] extends Array<infer T>
  ? T
  : never;

export const sitePolygonsConnection = v3Resource("sitePolygons", sitePolygonsIndex)
  .index<SitePolygonLightDto>(() => ({ queryParams: { lightResource: true } }))
  .pagination()
  .enabledProp()
  .filter<Omit<Filter<SitePolygonsIndexQueryParams>, "projectId[]" | "siteId[]">>()
  .addProps<{ entityName?: "projects" | "sites"; entityUuid?: string }>(({ entityName, entityUuid }) => {
    if (entityName === "projects" && entityUuid != null) return { queryParams: { "projectId[]": [entityUuid] } };
    if (entityName === "sites" && entityUuid != null) return { queryParams: { "siteId[]": [entityUuid] } };
    return {};
  })
  .buildConnection();

export const useSitePolygons = connectionHook(sitePolygonsConnection);

export const pruneSitePolygonsCache = (): void => {
  ApiSlice.pruneCache("sitePolygons");
  ApiSlice.pruneIndex("sitePolygons", "");
  ApiSlice.pruneCache("geojsonExports");
};

const createSitePolygonsConnection = v3Resource("sitePolygons", createSitePolygons)
  .create<SitePolygonLightDto, CreateSitePolygonAttributesDto>()
  .refetch(() => {
    pruneSitePolygonsCache();
  })
  .buildConnection();

export const useCreateSitePolygon = connectionHook(createSitePolygonsConnection);
export const loadCreateSitePolygon = connectionLoader(createSitePolygonsConnection);

const deleteSitePolygonInternal = deleterAsync("sitePolygons", deleteSitePolygonEndpoint, (uuid: string) => ({
  pathParams: { uuid }
}));

export const deleteSitePolygon = async (uuid: string): Promise<void> => {
  await deleteSitePolygonInternal(uuid);
  pruneBoundingBoxesCache();
};

type SitePolygonResourceIdentifier = {
  type: "sitePolygons";
  id: string;
};

const createBulkDeleteBody = (resources: SitePolygonResourceIdentifier[]): SitePolygonBulkDeleteBodyDto => {
  return {
    data: resources
  };
};

export type BulkSitePolygonAttributeChanges = SitePolygonBulkAttributeChangesDto;

export type SitePolygonStatusUpdateResponse = UpdateSitePolygonStatusResponse & {
  included?: JsonApiResource[];
};

export const formatSubmissionCommentDate = (isoDate: string | null | undefined): string => {
  if (isoDate == null || isoDate === "") {
    return "";
  }

  const date = new Date(isoDate);
  const day = date.getUTCDate().toString().padStart(2, "0");
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const year = date.getUTCFullYear();

  return `${day}/${month}/${year}`;
};

export const getStatusUpdateCommentCreatedAt = (response: SitePolygonStatusUpdateResponse): string | null => {
  const includedAuditComment = response.included?.find(resource => {
    if (resource.type !== "auditStatuses") {
      return false;
    }

    const attributes = resource.attributes as Partial<AuditStatusDto>;
    return attributes.type === "comment";
  });

  const auditAttributes = includedAuditComment?.attributes as Partial<AuditStatusDto> | undefined;
  const auditCreatedAt = auditAttributes?.dateCreated ?? (auditAttributes as { createdAt?: string | null })?.createdAt;
  if (auditCreatedAt != null) {
    return formatSubmissionCommentDate(auditCreatedAt);
  }

  const responseCreatedAt = response.data?.[0]?.attributes?.createdAt;
  if (responseCreatedAt != null) {
    return formatSubmissionCommentDate(responseCreatedAt);
  }

  return null;
};

export const bulkUpdateSitePolygonAttributes = async (
  uuids: string[],
  attributeChanges: BulkSitePolygonAttributeChanges
): Promise<void> => {
  const body: SitePolygonBulkAttributeUpdateBodyDto = {
    data: uuids.map(uuid => ({
      type: "sitePolygons" as const,
      id: uuid
    })),
    attributeChanges
  };

  const variables = { body };
  const fullUrl = resolveUrl(bulkUpdateSitePolygonAttributesEndpoint.url, {});
  const failureSelector = bulkUpdateSitePolygonAttributesEndpoint.fetchFailedSelector({});
  const previousFailure = failureSelector(ApiSlice.currentState);

  if (previousFailure != null) {
    ApiSlice.clearPending(fullUrl, bulkUpdateSitePolygonAttributesEndpoint.method);
  }

  bulkUpdateSitePolygonAttributesEndpoint.fetch(variables);

  const initialPending = ApiSlice.currentState.meta.pending[bulkUpdateSitePolygonAttributesEndpoint.method][fullUrl];
  const initialFailure = failureSelector(ApiSlice.currentState);

  if (initialPending == null && initialFailure == null) {
    pruneSitePolygonsCache();
    pruneBoundingBoxesCache();
    return;
  }

  if (initialFailure != null) {
    throw initialFailure;
  }

  await new Promise<void>((resolve, reject) => {
    const unsubscribe = ApiSlice.redux.subscribe(() => {
      const currentState = ApiSlice.currentState;
      const pending = currentState.meta.pending[bulkUpdateSitePolygonAttributesEndpoint.method][fullUrl];
      const failure = failureSelector(currentState);

      if (pending == null && failure == null) {
        unsubscribe();
        resolve();
      } else if (failure != null) {
        unsubscribe();
        reject(failure);
      }
    });
  });

  pruneSitePolygonsCache();
  pruneBoundingBoxesCache();
};

export const bulkUpdateSitePolygonStatus = async (
  uuids: string[],
  status: PolygonStatus,
  comment: string
): Promise<SitePolygonStatusUpdateResponse> => {
  const updateResources: SitePolygonResourceIdentifier[] = uuids.map(uuid => ({
    type: "sitePolygons",
    id: uuid
  }));

  const body: SitePolygonStatusBulkUpdateBodyDto = {
    comment,
    data: updateResources.map(resource => ({
      type: "sitePolygons" as const,
      id: resource.id
    }))
  };

  const variables = { body, pathParams: { status } };
  return updateSitePolygonStatus.fetchAwait(variables);
};

export const bulkDeleteSitePolygons = async (uuids: string[]): Promise<void> => {
  const deleteResources: SitePolygonResourceIdentifier[] = uuids.map(uuid => ({
    type: "sitePolygons",
    id: uuid
  }));

  const failureSelector = bulkDeleteSitePolygonsEndpoint.fetchFailedSelector({});
  const previousFailure = failureSelector(ApiSlice.currentState);
  if (previousFailure != null) {
    ApiSlice.clearPending(resolveUrl(bulkDeleteSitePolygonsEndpoint.url, {}), bulkDeleteSitePolygonsEndpoint.method);
  }

  const body = createBulkDeleteBody(deleteResources);
  bulkDeleteSitePolygonsEndpoint.fetch({ body });

  await new Promise<void>((resolve, reject) => {
    const unsubscribe = ApiSlice.redux.subscribe(() => {
      const currentState = ApiSlice.currentState;
      const deleted = currentState.meta.deleted.sitePolygons ?? [];
      const allDeleted = uuids.every(uuid => deleted.includes(uuid));
      const failure = failureSelector(currentState);

      if (allDeleted) {
        unsubscribe();
        resolve();
      } else if (failure != null) {
        unsubscribe();
        reject(failure);
      }
    });
  });

  pruneSitePolygonsCache();
  pruneBoundingBoxesCache();
};

export const loadAllSitePolygons = async (
  props: Omit<ConnectionProps<typeof sitePolygonsConnection>, "pageNumber" | "pageSize"> & {
    sortField?: string;
    sortDirection?: "ASC" | "DESC";
  }
): Promise<SitePolygonLightDto[]> => {
  const firstPageResponse = await loadConnection(sitePolygonsConnection, {
    ...props,
    pageSize: ALL_POLYGONS_PAGE_SIZE,
    pageNumber: 1,
    sortField: props.sortField,
    sortDirection: props.sortDirection ?? "ASC"
  });

  if (firstPageResponse.loadFailure) {
    throw firstPageResponse.loadFailure;
  }

  const polygons = firstPageResponse.data ?? [];
  const totalCount = firstPageResponse.indexTotal ?? 0;

  if (totalCount === 0 || totalCount <= ALL_POLYGONS_PAGE_SIZE) {
    return polygons;
  }

  const totalPages = Math.ceil(totalCount / ALL_POLYGONS_PAGE_SIZE);
  let allPolygons = [...polygons];

  for (let pageNumber = 2; pageNumber <= totalPages; pageNumber++) {
    const pageResponse = await loadConnection(sitePolygonsConnection, {
      ...props,
      pageSize: ALL_POLYGONS_PAGE_SIZE,
      pageNumber,
      sortField: props.sortField,
      sortDirection: props.sortDirection ?? "ASC"
    });

    if (pageResponse.loadFailure) {
      throw pageResponse.loadFailure;
    }

    allPolygons.push(...(pageResponse.data ?? []));
  }

  return allPolygons;
};

export const useAllSitePolygons = (
  props: Omit<ConnectionProps<typeof sitePolygonsConnection>, "pageNumber" | "pageSize"> & {
    sortField?: string;
    sortDirection?: "ASC" | "DESC";
  }
) => {
  const [allPolygons, setAllPolygons] = useState<SitePolygonLightDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<PendingError | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const stableProps = useStableProps(props);

  const fetchAllPages = useCallback(
    async (clearCache: boolean = false) => {
      setIsLoading(true);
      setError(null);
      setAllPolygons([]);
      setProgress(0);
      setTotal(0);

      try {
        if (clearCache) {
          ApiSlice.pruneCache("sitePolygons");
          ApiSlice.pruneCache("geojsonExports");

          const currentState = ApiSlice.currentState;
          const sitePolygonsIndices = currentState.meta.indices.sitePolygons ?? {};
          Object.keys(sitePolygonsIndices).forEach(indexKey => {
            ApiSlice.pruneIndex("sitePolygons", indexKey);
          });
        }

        const firstPageResponse = await loadConnection(sitePolygonsConnection, {
          ...stableProps,
          pageSize: ALL_POLYGONS_PAGE_SIZE,
          pageNumber: 1,
          sortField: stableProps.sortField,
          sortDirection: stableProps.sortDirection ?? "ASC"
        });

        if (firstPageResponse.loadFailure) {
          throw firstPageResponse.loadFailure;
        }

        const polygons = firstPageResponse.data ?? [];
        const totalCount = firstPageResponse.indexTotal ?? 0;

        setTotal(totalCount);
        setProgress(Math.min(ALL_POLYGONS_PAGE_SIZE, totalCount));

        if (totalCount === 0) {
          setAllPolygons([]);
          setIsLoading(false);
          return;
        }

        if (totalCount <= ALL_POLYGONS_PAGE_SIZE) {
          setAllPolygons(polygons);
          setIsLoading(false);
          return;
        }

        const totalPages = Math.ceil(totalCount / ALL_POLYGONS_PAGE_SIZE);
        let allFetchedPolygons = [...polygons];

        for (let pageNumber = 2; pageNumber <= totalPages; pageNumber++) {
          const pageResponse = await loadConnection(sitePolygonsConnection, {
            ...stableProps,
            pageSize: ALL_POLYGONS_PAGE_SIZE,
            pageNumber: pageNumber,
            sortField: stableProps.sortField,
            sortDirection: stableProps.sortDirection ?? "ASC"
          });

          if (pageResponse.loadFailure) {
            throw pageResponse.loadFailure;
          }

          allFetchedPolygons.push(...(pageResponse.data ?? []));
          setProgress(Math.min(allFetchedPolygons.length, totalCount));
        }

        setAllPolygons(allFetchedPolygons);
      } catch (e: any) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    },
    [stableProps]
  );

  const refetch = useCallback(async () => {
    await fetchAllPages(true);
  }, [fetchAllPages]);

  useEffect(() => {
    if (!stableProps.enabled || isEmpty(stableProps.entityUuid)) {
      setIsLoading(false);
      setAllPolygons([]);
      setProgress(0);
      setTotal(0);
      return;
    }

    fetchAllPages();
  }, [stableProps, fetchAllPages]);

  return {
    data: allPolygons,
    isLoading,
    error,
    progress,
    total,
    refetch
  };
};

export const createSitePolygonsResource = async (
  attributes: CreateSitePolygonAttributesDto
): Promise<SitePolygonLightDto> => {
  const response = await createSitePolygons.fetchParallel({
    body: {
      data: {
        type: "sitePolygons",
        attributes
      }
    }
  });

  pruneSitePolygonsCache();

  return response.data?.attributes!;
};

export type PolygonVersionGeometryFeature = {
  type: "Feature";
  geometry: GeoJSON.Geometry;
  properties: {
    siteId: string;
  };
};

export type CreateVersionOptions = {
  primaryUuid: string;
  changeReason: string;
  geometry?: PolygonVersionGeometryFeature;
  attributeChanges?: AttributeChangesDto;
};

export const createPolygonVersion = async (options: CreateVersionOptions): Promise<SitePolygonLightDto> => {
  const { primaryUuid, changeReason, geometry, attributeChanges } = options;

  const geometries: CreateSitePolygonAttributesDto["geometries"] = geometry
    ? [
        {
          type: "FeatureCollection",
          features: [geometry] as unknown as NonNullable<
            CreateSitePolygonAttributesDto["geometries"]
          >[number]["features"]
        }
      ]
    : undefined;

  const attributes: CreateSitePolygonAttributesDto = {
    baseSitePolygonUuid: primaryUuid,
    changeReason,
    ...(geometries && { geometries }),
    ...(attributeChanges && { attributeChanges })
  };

  const result = await createSitePolygonsResource(attributes);
  return result;
};

export const createBlankVersion = async (primaryUuid: string, changeReason: string): Promise<SitePolygonLightDto> => {
  const versionsResponse = await loadListPolygonVersions({ uuid: primaryUuid });
  const latestVersion = versionsResponse?.data?.[0];
  const latestVersionName = latestVersion?.name;

  const attributeChanges: AttributeChangesDto = latestVersionName ? { polyName: latestVersionName } : { polyName: "" };

  return createPolygonVersion({
    primaryUuid,
    changeReason,
    attributeChanges
  });
};

export const createVersionWithGeometry = async (
  primaryUuid: string,
  changeReason: string,
  geometry: CreateVersionOptions["geometry"]
): Promise<SitePolygonLightDto> => {
  if (!geometry) {
    throw new Error("Geometry is required for createVersionWithGeometry");
  }
  return createPolygonVersion({
    primaryUuid,
    changeReason,
    geometry
  });
};

export const createVersionWithAttributes = async (
  primaryUuid: string,
  changeReason: string,
  attributeChanges: AttributeChangesDto
): Promise<SitePolygonLightDto> => {
  return createPolygonVersion({
    primaryUuid,
    changeReason,
    attributeChanges
  });
};
