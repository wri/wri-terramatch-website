import { IdProp, v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import { resourceUpdater } from "@/connections/util/resourceMutator";
import {
  deleteSitePolygonVersion,
  listSitePolygonVersions,
  updateSitePolygonVersion,
  UpdateSitePolygonVersionVariables
} from "@/generated/v3/researchService/researchServiceComponents";
import { SitePolygonLightDto, VersionUpdateAttributes } from "@/generated/v3/researchService/researchServiceSchemas";
import ApiSlice from "@/store/apiSlice";

const listPolygonVersionsConnection = v3Resource("sitePolygons", listSitePolygonVersions)
  .index<SitePolygonLightDto>(({ uuid }: { uuid?: string }) => ({ pathParams: { uuid: uuid || "" } }))
  .enabledProp()
  .addProps<{ uuid?: string }>(() => ({}))
  .refetch((props, variablesFactory) => {
    const variables = variablesFactory(props);
    if (variables == null || !variables.pathParams?.uuid) return;
    ApiSlice.pruneIndex("sitePolygons", "");
  })
  .buildConnection();

export const useListPolygonVersions = connectionHook(listPolygonVersionsConnection);
export const loadListPolygonVersions = connectionLoader(listPolygonVersionsConnection);

const polygonVersionUpdateConnection = v3Resource("sitePolygons", listSitePolygonVersions)
  .singleResource<SitePolygonLightDto>(({ id }: IdProp) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .update<VersionUpdateAttributes, UpdateSitePolygonVersionVariables>(updateSitePolygonVersion)
  .buildConnection();

const updatePolygonVersionUpdater = resourceUpdater(polygonVersionUpdateConnection);

export const updatePolygonVersionAsync = async (uuid: string, attributes: { isActive: boolean; comment?: string }) => {
  const result = await updatePolygonVersionUpdater(attributes, { id: uuid });
  ApiSlice.pruneCache("sitePolygons", [uuid]);
  ApiSlice.pruneIndex("sitePolygons", "");
  return result;
};

export const deletePolygonVersion = deleterAsync("sitePolygons", deleteSitePolygonVersion, (uuid: string) => ({
  pathParams: { uuid }
}));
