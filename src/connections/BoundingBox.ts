import { isEmpty } from "lodash";

import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import {
  boundingBoxGet,
  BoundingBoxGetQueryParams,
  BoundingBoxGetVariables
} from "@/generated/v3/researchService/researchServiceComponents";
import { BoundingBoxDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { boundingBoxGetFetchFailed } from "@/generated/v3/researchService/researchServiceSelectors";
import { useConnection } from "@/hooks/useConnection";

import { ApiConnectionFactory } from "./util/apiConnectionFactory";

const hasValidParams = ({
  polygonUuid,
  siteUuid,
  projectUuid,
  landscapes,
  country
}: BoundingBoxGetQueryParams = {}): boolean =>
  !isEmpty(polygonUuid) || !isEmpty(siteUuid) || !isEmpty(projectUuid) || !isEmpty(landscapes) || !isEmpty(country);

const boundingBoxConnection = ApiConnectionFactory.singleByFilter<
  BoundingBoxDto,
  BoundingBoxGetVariables,
  BoundingBoxGetQueryParams
>("boundingBoxes", boundingBoxGet)
  .enabledProp()
  .loadFailure(boundingBoxGetFetchFailed)
  .buildConnection();

export const useBoundingBox = (filter: BoundingBoxGetQueryParams) => {
  const result = useConnection(boundingBoxConnection, { filter, enabled: hasValidParams(filter) });
  const { bbox } = result[1].data ?? {};
  return bbox as BBox | undefined;
};
