import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import {
  deleteAnrPlotGeometry as deleteAnrPlotGeometryEndpoint,
  getAnrPlotGeometry,
  getAnrPlotGeometryGeoJson,
  upsertAnrPlotGeometry
} from "@/generated/v3/researchService/researchServiceComponents";
import { AnrPlotGeometryDto, GeoJsonExportDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { resolveUrl } from "@/generated/v3/utils";
import ApiSlice from "@/store/apiSlice";

type AnrPlotGeometryProps = {
  sitePolygonUuid?: string;
};

const anrPlotGeometryConnection = v3Resource("anrPlotGeometries", getAnrPlotGeometry)
  .singleByCustomId<AnrPlotGeometryDto, AnrPlotGeometryProps>(
    ({ sitePolygonUuid }) => {
      if (!sitePolygonUuid) return undefined;
      return { pathParams: { sitePolygonUuid } };
    },
    ({ sitePolygonUuid }) => sitePolygonUuid ?? ""
  )
  .enabledProp()
  .isLoading()
  .buildConnection();

export const useAnrPlotGeometry = connectionHook(anrPlotGeometryConnection);
export const loadAnrPlotGeometry = connectionLoader(anrPlotGeometryConnection);

const anrPlotGeometryGeoJsonConnection = v3Resource("geojsonExports", getAnrPlotGeometryGeoJson)
  .singleByCustomId<GeoJsonExportDto, AnrPlotGeometryProps>(
    ({ sitePolygonUuid }) => {
      if (!sitePolygonUuid) return undefined;
      return { pathParams: { sitePolygonUuid } };
    },
    ({ sitePolygonUuid }) => sitePolygonUuid ?? ""
  )
  .enabledProp()
  .buildConnection();

export const useAnrPlotGeometryGeoJson = connectionHook(anrPlotGeometryGeoJsonConnection);
export const loadAnrPlotGeometryGeoJson = connectionLoader(anrPlotGeometryGeoJsonConnection);

export const deleteAnrPlotGeometry = deleterAsync(
  "anrPlotGeometries",
  deleteAnrPlotGeometryEndpoint,
  (sitePolygonUuid: string) => ({ pathParams: { sitePolygonUuid } })
);

export const upsertAnrPlotGeometryResource = async (
  sitePolygonUuid: string,
  file: File
): Promise<AnrPlotGeometryDto> => {
  const formData = new FormData();
  formData.append("file", file);

  const urlVariables = { pathParams: { sitePolygonUuid } };
  const fullUrl = resolveUrl(upsertAnrPlotGeometry.url, urlVariables);
  const failureSelector = upsertAnrPlotGeometry.fetchFailedSelector(urlVariables);

  const previousFailure = failureSelector(ApiSlice.currentState);
  if (previousFailure != null) {
    ApiSlice.clearPending(fullUrl, upsertAnrPlotGeometry.method);
  }

  upsertAnrPlotGeometry.fetch({ ...urlVariables, body: formData } as any);

  const initialPending = ApiSlice.currentState.meta.pending[upsertAnrPlotGeometry.method][fullUrl];
  const initialFailure = failureSelector(ApiSlice.currentState);

  if (initialPending == null && !initialFailure) {
    const result = ApiSlice.currentState.anrPlotGeometries[sitePolygonUuid];
    return result?.attributes as AnrPlotGeometryDto;
  }

  if (initialFailure != null) {
    throw initialFailure;
  }

  return await new Promise<AnrPlotGeometryDto>((resolve, reject) => {
    const unsubscribe = ApiSlice.redux.subscribe(() => {
      const currentState = ApiSlice.currentState;
      const pending = currentState.meta.pending[upsertAnrPlotGeometry.method][fullUrl];
      const failure = failureSelector(currentState);

      if (pending == null && failure == null) {
        unsubscribe();
        ApiSlice.pruneCache("geojsonExports", [sitePolygonUuid]);
        const result = currentState.anrPlotGeometries[sitePolygonUuid];
        resolve(result?.attributes as AnrPlotGeometryDto);
      } else if (failure != null) {
        unsubscribe();
        reject(failure);
      }
    });
  });
};
