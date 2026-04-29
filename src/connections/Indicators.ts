import { pruneSitePolygonsCache } from "@/connections/SitePolygons";
import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import {
  startIndicatorCalculation,
  StartIndicatorCalculationPathParams
} from "@/generated/v3/researchService/researchServiceComponents";
import { IndicatorsAttributes, SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";

const startIndicatorCalculationConnection = v3Resource("sitePolygons", startIndicatorCalculation)
  .create<SitePolygonLightDto, { slug: StartIndicatorCalculationPathParams["slug"] }>(({ slug }) => ({
    pathParams: { slug }
  }))
  .refetch(() => {
    pruneSitePolygonsCache();
  })
  .buildConnection();

export const useStartIndicatorCalculation = connectionHook(startIndicatorCalculationConnection);
export const loadStartIndicatorCalculation = connectionLoader(startIndicatorCalculationConnection);

export const startIndicatorCalculationResource = async ({
  slug,
  body
}: {
  slug: StartIndicatorCalculationPathParams["slug"];
  body: IndicatorsAttributes;
}) => {
  await startIndicatorCalculation.fetchParallel({
    pathParams: { slug },
    body: {
      data: {
        type: "sitePolygons",
        attributes: body
      }
    }
  });
  pruneSitePolygonsCache();
};
