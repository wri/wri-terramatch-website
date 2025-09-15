import { isEmpty } from "lodash";

import { v3Resource } from "@/connections/util/apiConnectionFactory";
import {
  getPolygonValidation,
  GetPolygonValidationPathParams
} from "@/generated/v3/researchService/researchServiceComponents";
import { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useConnection } from "@/hooks/useConnection";

const hasValidParams = (pathParams: GetPolygonValidationPathParams | undefined): boolean => {
  const isValid =
    pathParams != null &&
    pathParams.polygonUuid != null &&
    pathParams.polygonUuid !== "" &&
    pathParams.polygonUuid !== "undefined" &&
    !isEmpty(pathParams.polygonUuid);

  return isValid;
};

const validationConnection = v3Resource("validations", getPolygonValidation)
  .singleResource<ValidationDto>(({ id }) => {
    if (id == null) return undefined;
    return { pathParams: { polygonUuid: id } };
  })
  .enabledProp()
  .buildConnection();

export const usePolygonValidation = (pathParams: GetPolygonValidationPathParams) => {
  const result = useConnection(validationConnection, {
    id: pathParams.polygonUuid,
    enabled: hasValidParams(pathParams)
  });

  const validationData = result[1].data;

  return validationData;
};
