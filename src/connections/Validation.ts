import { isEmpty } from "lodash";

import { v3Resource } from "@/connections/util/apiConnectionFactory";
import {
  getPolygonValidation,
  GetPolygonValidationPathParams
} from "@/generated/v3/researchService/researchServiceComponents";
import { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useConnection } from "@/hooks/useConnection";

const hasValidParams = (pathParams: GetPolygonValidationPathParams | undefined): boolean =>
  pathParams != null && !isEmpty(pathParams.polygonUuid);

const validationConnection = v3Resource("validations", getPolygonValidation)
  .singleByFilter<ValidationDto, GetPolygonValidationPathParams>()
  .enabledProp()
  .buildConnection();

export const usePolygonValidation = (pathParams: GetPolygonValidationPathParams) => {
  const result = useConnection(validationConnection, {
    pathParams,
    enabled: hasValidParams(pathParams)
  });
  const validationData = result[1].data;
  return validationData;
};
