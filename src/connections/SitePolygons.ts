import { createSelector } from "reselect";

import { sitePolygonsIndex } from "@/generated/v3/researchService/researchServiceComponents";
import { sitePolygonsIndexFetchFailed } from "@/generated/v3/researchService/researchServicePredicates";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { ApiDataStore, indexMetaSelector, PendingErrorState, ResponseMeta } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

export type SitePolygonIndexConnectionProps = {
  entityName: string;
  entityUuid: string;
  pageSize?: number;
  pageNumber?: number;
  lightResource?: boolean;
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

const ENTITY_QUERY_KEYS: Record<string, string> = {
  projects: "projectId[]",
  sites: "siteId[]"
};

export type SitePolygonIndexConnection<SitePolygonLightDto> = {
  sitePolygons?: SitePolygonLightDto[];
  meta?: ResponseMeta["page"];
  fetchFailure?: PendingErrorState | null;
};

const sitePolygonQueryParams = (props: SitePolygonIndexConnectionProps) => {
  const queryKey = ENTITY_QUERY_KEYS[props.entityName];
  const queryParams: Record<string, string | number | boolean | null | undefined> = {
    "page[number]": props.pageNumber ?? 1,
    "page[size]": props.pageSize ?? 10,
    lightResource: props.lightResource ?? false
  };

  if (queryKey) {
    queryParams[queryKey] = props.entityUuid;
  }

  if (props.presentIndicator) {
    queryParams["presentIndicator[]"] = props.presentIndicator;
  }

  return { queryParams };
};

const indexIsLoaded = ({ sitePolygons, fetchFailure }: SitePolygonIndexConnection<SitePolygonLightDto>) =>
  sitePolygons != null || fetchFailure != null;

const sitePolygonCacheKey = (props: SitePolygonIndexConnectionProps) =>
  `${props.entityName}:${props.entityUuid}:${props.pageSize}:${props.pageNumber}:${props.presentIndicator}`;

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
          indexMetaSelector("sitePolygons", sitePolygonQueryParams(props)),
          (store: ApiDataStore) => store.sitePolygons,
          sitePolygonsIndexFetchFailed(sitePolygonQueryParams(props))
        ],
        (indexMeta, sitePolygonsStore, fetchFailure) => {
          if (!indexMeta) return { fetchFailure };

          const sitePolygons: SitePolygonLightDto[] = indexMeta.ids
            .map(id => sitePolygonsStore[id]?.attributes as SitePolygonLightDto)
            .filter(Boolean);

          return { sitePolygons, meta: indexMeta?.page, fetchFailure };
        }
      )
  )
};

export const useSitePolygons = connectionHook(sitePolygonsConnection);
export const loadSitePolygons = connectionLoader(sitePolygonsConnection);
