import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  getSitePolygonsGeoJson,
  GetSitePolygonsGeoJsonQueryParams
} from "@/generated/v3/researchService/researchServiceComponents";
import { GeoJsonExportDto } from "@/generated/v3/researchService/researchServiceSchemas";

type PolygonGeoJsonProps = {
  uuid?: string;
  includeExtendedData?: boolean;
  geometryOnly?: boolean;
  enabled?: boolean;
};

type SitePolygonsGeoJsonProps = {
  siteUuid?: string;
  includeExtendedData?: boolean;
  geometryOnly?: boolean;
  enabled?: boolean;
};

type ProjectPolygonsGeoJsonProps = {
  projectUuid?: string;
  includeExtendedData?: boolean;
  geometryOnly?: boolean;
  enabled?: boolean;
};

const singlePolygonGeoJsonConnection = v3Resource("geojsonExports", getSitePolygonsGeoJson)
  .singleByCustomId<GeoJsonExportDto, PolygonGeoJsonProps>(
    ({ uuid, includeExtendedData, geometryOnly }) => {
      if (!uuid) return undefined;
      return {
        queryParams: {
          uuid,
          ...(includeExtendedData !== undefined && { includeExtendedData }),
          ...(geometryOnly !== undefined && { geometryOnly })
        } as GetSitePolygonsGeoJsonQueryParams
      };
    },
    ({ uuid }) => uuid ?? ""
  )
  .enabledProp()
  .buildConnection();

const sitePolygonsGeoJsonConnection = v3Resource("geojsonExports", getSitePolygonsGeoJson)
  .singleByCustomId<GeoJsonExportDto, SitePolygonsGeoJsonProps>(
    ({ siteUuid, includeExtendedData, geometryOnly }) => {
      if (!siteUuid) return undefined;
      return {
        queryParams: {
          siteUuid,
          ...(includeExtendedData !== undefined && { includeExtendedData }),
          ...(geometryOnly !== undefined && { geometryOnly })
        } as GetSitePolygonsGeoJsonQueryParams
      };
    },
    ({ siteUuid }) => siteUuid ?? ""
  )
  .enabledProp()
  .buildConnection();

const projectPolygonsGeoJsonConnection = v3Resource("geojsonExports", getSitePolygonsGeoJson)
  .singleByCustomId<GeoJsonExportDto, ProjectPolygonsGeoJsonProps>(
    ({ projectUuid, includeExtendedData, geometryOnly }) => {
      if (!projectUuid) return undefined;
      return {
        queryParams: {
          projectUuid,
          ...(includeExtendedData !== undefined && { includeExtendedData }),
          ...(geometryOnly !== undefined && { geometryOnly })
        } as GetSitePolygonsGeoJsonQueryParams
      };
    },
    ({ projectUuid }) => projectUuid ?? ""
  )
  .enabledProp()
  .buildConnection();

export const usePolygonGeoJson = connectionHook(singlePolygonGeoJsonConnection);
export const loadPolygonGeoJson = connectionLoader(singlePolygonGeoJsonConnection);
export const useSitePolygonsGeoJson = connectionHook(sitePolygonsGeoJsonConnection);
export const loadSitePolygonsGeoJson = connectionLoader(sitePolygonsGeoJsonConnection);
export const useProjectPolygonsGeoJson = connectionHook(projectPolygonsGeoJsonConnection);
export const loadProjectPolygonsGeoJson = connectionLoader(projectPolygonsGeoJsonConnection);
