import { isEmpty } from "lodash";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { v3Endpoint } from "@/connections/util/apiConnectionFactory";
import { boundingBoxGet, BoundingBoxGetQueryParams } from "@/generated/v3/researchService/researchServiceComponents";
import { BoundingBoxDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useConnection } from "@/hooks/useConnection";

const hasValidParams = ({
  polygonUuid,
  siteUuid,
  projectUuid,
  landscapes,
  country
}: BoundingBoxGetQueryParams = {}): boolean =>
  !isEmpty(polygonUuid) || !isEmpty(siteUuid) || !isEmpty(projectUuid) || !isEmpty(landscapes) || !isEmpty(country);

const boundingBoxConnection = v3Endpoint("boundingBoxes", boundingBoxGet)
  .singleByFilter<BoundingBoxDto, BoundingBoxGetQueryParams>()
  .enabledProp()
  .buildConnection();

export const useBoundingBox = (filter: BoundingBoxGetQueryParams) => {
  const result = useConnection(boundingBoxConnection, { filter, enabled: hasValidParams(filter) });
  const { bbox } = result[1].data ?? {};
  return bbox as BBox | undefined;
};
