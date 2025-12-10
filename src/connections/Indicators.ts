import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  startIndicatorCalculation,
  StartIndicatorCalculationPathParams
} from "@/generated/v3/researchService/researchServiceComponents";
import { IndicatorsAttributes, SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import { loadConnection } from "@/utils/loadConnection";

const startIndicatorCalculationConnection = v3Resource("sitePolygons", startIndicatorCalculation)
  .create<SitePolygonLightDto, { slug: StartIndicatorCalculationPathParams["slug"] }>(({ slug }) => ({
    pathParams: { slug }
  }))
  .refetch(() => {
    ApiSlice.pruneCache("sitePolygons");
    ApiSlice.pruneIndex("sitePolygons", "");
  })
  .buildConnection();

export const useStartIndicatorCalculation = connectionHook(startIndicatorCalculationConnection);
export const loadStartIndicatorCalculation = connectionLoader(startIndicatorCalculationConnection);

const startIndicatorCalculationResourceConnection = v3Resource("sitePolygons", startIndicatorCalculation)
  .create<SitePolygonLightDto, { slug: StartIndicatorCalculationPathParams["slug"] }>(({ slug }) => ({
    pathParams: { slug }
  }))
  .buildConnection();

export const startIndicatorCalculationResource = async ({
  slug,
  body
}: {
  slug: StartIndicatorCalculationPathParams["slug"];
  body: IndicatorsAttributes;
}) => {
  const { create } = await loadConnection(startIndicatorCalculationResourceConnection, { slug });
  (create as (attributes: IndicatorsAttributes) => void)(body);
};
