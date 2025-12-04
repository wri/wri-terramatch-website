import { isEmpty } from "lodash";
import { useCallback, useEffect, useState } from "react";

import { loadListPolygonVersions } from "@/connections/PolygonVersion";
import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import {
  bulkDeleteSitePolygons as bulkDeleteSitePolygonsEndpoint,
  createSitePolygons,
  deleteSitePolygon as deleteSitePolygonEndpoint,
  sitePolygonsIndex,
  SitePolygonsIndexQueryParams
} from "@/generated/v3/researchService/researchServiceComponents";
import {
  AttributeChangesDto,
  CreateSitePolygonAttributesDto,
  SitePolygonBulkDeleteBodyDto,
  SitePolygonDeleteResource,
  SitePolygonLightDto
} from "@/generated/v3/researchService/researchServiceSchemas";
import { resolveUrl } from "@/generated/v3/utils";
import { useStableProps } from "@/hooks/useStableProps";
import ApiSlice, { PendingError } from "@/store/apiSlice";
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

const createSitePolygonsConnection = v3Resource("sitePolygons", createSitePolygons)
  .create<SitePolygonLightDto, CreateSitePolygonAttributesDto>()
  .refetch(() => {
    ApiSlice.pruneCache("sitePolygons");
    ApiSlice.pruneIndex("sitePolygons", "");
  })
  .buildConnection();

export const useCreateSitePolygon = connectionHook(createSitePolygonsConnection);
export const loadCreateSitePolygon = connectionLoader(createSitePolygonsConnection);

export const deleteSitePolygon = deleterAsync("sitePolygons", deleteSitePolygonEndpoint, (uuid: string) => ({
  pathParams: { uuid }
}));

export const bulkDeleteSitePolygons = async (uuids: string[]): Promise<void> => {
  const deleteResources: SitePolygonDeleteResource[] = uuids.map(uuid => ({
    type: "sitePolygons",
    id: uuid
  }));

  const body: SitePolygonBulkDeleteBodyDto = {
    data: deleteResources
  };

  const failureSelector = bulkDeleteSitePolygonsEndpoint.fetchFailedSelector({});
  const previousFailure = failureSelector(ApiSlice.currentState);
  if (previousFailure != null) {
    ApiSlice.clearPending(resolveUrl(bulkDeleteSitePolygonsEndpoint.url, {}), bulkDeleteSitePolygonsEndpoint.method);
  }

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

  ApiSlice.pruneCache("sitePolygons");
  ApiSlice.pruneIndex("sitePolygons", "");
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

  ApiSlice.pruneCache("sitePolygons");
  ApiSlice.pruneIndex("sitePolygons", "");

  return response.data?.attributes!;
};

export type CreateVersionOptions = {
  primaryUuid: string;
  changeReason: string;
  geometry?: {
    type: "Feature";
    geometry: any;
    properties: {
      site_id: string;
    };
  };
  attributeChanges?: AttributeChangesDto;
};

export const createPolygonVersion = async (options: CreateVersionOptions): Promise<SitePolygonLightDto> => {
  const { primaryUuid, changeReason, geometry, attributeChanges } = options;

  const geometries = geometry
    ? [
        {
          type: "FeatureCollection",
          features: [geometry] as any
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
