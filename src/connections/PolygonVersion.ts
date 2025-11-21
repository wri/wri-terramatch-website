import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import {
  deleteSitePolygonVersion,
  listSitePolygonVersions,
  updateSitePolygonVersion
} from "@/generated/v3/researchService/researchServiceComponents";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ApiSlice from "@/store/apiSlice";

const listPolygonVersionsConnection = v3Resource("sitePolygons", listSitePolygonVersions)
  .index<SitePolygonLightDto>(({ uuid }: { uuid?: string }) => (uuid ? { pathParams: { uuid } } : undefined))
  .enabledProp()
  .addProps<{ uuid?: string }>(() => ({}))
  .buildConnection();

export const useListPolygonVersions = connectionHook(listPolygonVersionsConnection);
export const loadListPolygonVersions = connectionLoader(listPolygonVersionsConnection);

export const updatePolygonVersionAsync = async (uuid: string, attributes: { isActive: boolean; comment?: string }) => {
  const response = await updateSitePolygonVersion.fetch({
    pathParams: { uuid },
    body: {
      data: {
        type: "sitePolygons",
        id: uuid,
        attributes
      }
    }
  });

  ApiSlice.pruneCache("sitePolygons", [uuid]);
  ApiSlice.pruneIndex("sitePolygons", "");

  return response;
};

export const deletePolygonVersion = deleterAsync("sitePolygons", deleteSitePolygonVersion, (uuid: string) => ({
  pathParams: { uuid }
}));
