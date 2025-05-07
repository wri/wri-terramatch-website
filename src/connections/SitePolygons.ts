import { Dictionary } from "lodash";
import { createSelector } from "reselect";

import {
  sitePolygonsIndex,
  SitePolygonsIndexQueryParams
} from "@/generated/v3/researchService/researchServiceComponents";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import {
  sitePolygonsIndexFetchFailed,
  sitePolygonsIndexIndexMeta
} from "@/generated/v3/researchService/researchServiceSelectors";
import { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export type SitePolygonIndexConnectionProps = {
  entityName: string;
  entityUuid: string;
  search?: string;
  pageSize?: number;
  pageNumber?: number;
  presentIndicator?:
    | "treeCover"
    | "treeCoverLoss"
    | "treeCoverLossFires"
    | "restorationByEcoRegion"
    | "restorationByStrategy"
    | "restorationByLandUse"
    | "treeCount"
    | "earlyTreeVerification"
    | "fieldMonitoring"
    | "msuCarbon";
};

const ENTITY_QUERY_KEYS: Dictionary<keyof SitePolygonsIndexQueryParams> = {
  projects: "projectId[]",
  sites: "siteId[]"
};

type EntityQueryKey = SitePolygonsIndexQueryParams["projectId[]"] | SitePolygonsIndexQueryParams["siteId[]"];

export type SitePolygonIndexConnection<SitePolygonLightDto> = {
  sitePolygons?: SitePolygonLightDto[];
  total?: number;
  fetchFailure?: PendingErrorState | null;
};

const sitePolygonQueryParams = (props: SitePolygonIndexConnectionProps) => {
  const queryKey = ENTITY_QUERY_KEYS[props.entityName];
  const queryParams: SitePolygonsIndexQueryParams = {
    "page[number]": props.pageNumber ?? 1,
    "page[size]": props.pageSize ?? 10,
    search: props.search,
    lightResource: true,
    includeTestProjects: false
  };

  if (queryKey != null) {
    (queryParams[queryKey] as EntityQueryKey) = [props.entityUuid];
  }

  if (props.presentIndicator) {
    queryParams["presentIndicator[]"] = [props.presentIndicator];
  }

  return { queryParams };
};

const indexIsLoaded = ({ sitePolygons, fetchFailure }: SitePolygonIndexConnection<SitePolygonLightDto>) =>
  sitePolygons != null || fetchFailure != null;

const sitePolygonCacheKey = (props: SitePolygonIndexConnectionProps) =>
  `${props.entityName}:${props.entityUuid}:${props.pageSize}:${props.pageNumber}:${props.presentIndicator}:${props.search}`;

const sitePolygonsConnection: Connection<
  SitePolygonIndexConnection<SitePolygonLightDto>,
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
          sitePolygonsIndexIndexMeta("sitePolygons", sitePolygonQueryParams(props)),
          (store: ApiDataStore) => store.sitePolygons,
          sitePolygonsIndexFetchFailed(sitePolygonQueryParams(props))
        ],
        (indexMeta, sitePolygonsStore, fetchFailure) => {
          if (!indexMeta) return { fetchFailure };

          const sitePolygons: SitePolygonLightDto[] = indexMeta.ids
            .map(id => sitePolygonsStore[id]?.attributes)
            .filter(Boolean);

          return { sitePolygons, total: indexMeta?.total, fetchFailure };
        }
      )
  )
};

export const useSitePolygons = connectionHook(sitePolygonsConnection);
export const loadSitePolygons = connectionLoader(sitePolygonsConnection);
