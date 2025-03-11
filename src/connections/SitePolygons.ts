import { createSelector } from "reselect";

import { sitePolygonsIndex } from "@/generated/v3/researchService/researchServiceComponents";
import { sitePolygonsIndexFetchFailed } from "@/generated/v3/researchService/researchServicePredicates";
import { SitePolygonDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ApiSlice, { ApiDataStore, indexMetaSelector, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export type SitePolygonConnectionParams = {
  entityName: string;
  entityUuid: string;
};

export type SitePolygonIndexConnectionProps = SitePolygonConnectionParams & {
  pageSize?: number;
  pageNumber?: number;
};

const ENTITY_QUERY_KEYS: Record<string, string> = {
  projects: "projectId[]",
  sites: "siteId[]"
};

export type SitePolygonIndexConnection<SitePolygonDto> = {
  sitePolygons?: SitePolygonDto[];
  indexTotal?: number;
  fetchFailure?: PendingErrorState | null;
  refetch: () => void;
};

const sitePolygonQueryParams = (props: SitePolygonIndexConnectionProps) => {
  const queryKey = ENTITY_QUERY_KEYS[props.entityName];
  return {
    queryParams: {
      "page[number]": props.pageNumber ?? 0,
      "page[size]": props.pageSize ?? 10,
      ...(queryKey ? { [queryKey]: props.entityUuid } : {})
    }
  };
};

const indexIsLoaded = ({ sitePolygons, fetchFailure }: SitePolygonIndexConnection<SitePolygonDto>) =>
  sitePolygons != null || fetchFailure != null;

const sitePolygonCacheKey = (props: SitePolygonIndexConnectionProps) =>
  `${props.entityName}:${props.entityUuid}:${props.pageSize}:${props.pageNumber}`;

const sitePolygonsConnection: Connection<
  SitePolygonIndexConnection<SitePolygonDto>,
  SitePolygonIndexConnectionProps
> = {
  load: (connection, props) => {
    if (!indexIsLoaded(connection)) sitePolygonsIndex(sitePolygonQueryParams(props));
  },

  isLoaded: indexIsLoaded,

  selector: selectorCache(
    props => sitePolygonCacheKey(props),
    props =>
      createSelector(
        [
          indexMetaSelector("sitePolygons", sitePolygonQueryParams(props)),
          (store: ApiDataStore) => store.sitePolygons ?? {},
          sitePolygonsIndexFetchFailed(sitePolygonQueryParams(props))
        ],
        (indexMeta, sitePolygonsStore, fetchFailure) => {
          const refetch = () => ApiSlice.pruneIndex("sitePolygons", "");
          if (!indexMeta) return { refetch, fetchFailure };

          const sitePolygons: SitePolygonDto[] = indexMeta.ids
            .map(id => sitePolygonsStore[id]?.attributes as SitePolygonDto)
            .filter(Boolean);

          return { sitePolygons, indexTotal: indexMeta.page?.total, refetch, fetchFailure };
        }
      )
  )
};

export const useSitePolygons = connectionHook(sitePolygonsConnection);
export const loadSitePolygons = connectionLoader(sitePolygonsConnection);
