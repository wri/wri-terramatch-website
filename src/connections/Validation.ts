import { isEmpty } from "lodash";
import { useCallback, useState } from "react";

import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { resourceCreator } from "@/connections/util/resourceCreator";
import {
  createPolygonValidations,
  getPolygonValidation,
  GetPolygonValidationPathParams,
  getSiteValidation
} from "@/generated/v3/researchService/researchServiceComponents";
import { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import ApiSlice from "@/store/apiSlice";
import { loadConnection } from "@/utils/loadConnection";

const hasValidParams = (pathParams: GetPolygonValidationPathParams | undefined): boolean =>
  !isEmpty(pathParams?.polygonUuid) && pathParams?.polygonUuid !== "undefined";

const validationConnection = v3Resource("validations", getPolygonValidation)
  .singleResource<ValidationDto>(({ id }) => {
    if (id == null) return undefined;
    return { pathParams: { polygonUuid: id } };
  })
  .enabledProp()
  .buildConnection();

export const usePolygonValidation = (pathParams: GetPolygonValidationPathParams) => {
  const [, { data }] = useConnection(validationConnection, {
    id: pathParams.polygonUuid,
    enabled: hasValidParams(pathParams)
  });
  return data;
};

const siteValidationConnection = v3Resource("validations", getSiteValidation)
  .index<ValidationDto, { siteUuid: string; criteriaId?: number }>(({ siteUuid, criteriaId }) => ({
    pathParams: { siteUuid },
    queryParams: { criteriaId }
  }))
  .pagination()
  .enabledProp()
  .buildConnection();

const ALL_VALIDATIONS_PAGE_SIZE = 100;

export const useAllSiteValidations = (siteUuid: string, criteriaId?: number) => {
  const [allValidations, setAllValidations] = useState<ValidationDto[]>([]);
  const [total, setTotal] = useState(0);

  const fetchAllValidationPages = useCallback(
    async (clearCache: boolean = false) => {
      if (siteUuid == null) return;

      setAllValidations([]);
      setTotal(0);

      try {
        if (clearCache) {
          ApiSlice.pruneCache("validations");

          const currentState = ApiSlice.currentState;
          const validationIndices = currentState.meta.indices.validations ?? {};
          Object.keys(validationIndices).forEach(indexKey => {
            ApiSlice.pruneIndex("validations", indexKey);
          });
        }

        const firstPageResponse = await loadConnection(siteValidationConnection, {
          siteUuid,
          criteriaId,
          pageSize: ALL_VALIDATIONS_PAGE_SIZE,
          pageNumber: 1,
          enabled: true
        });

        if (firstPageResponse.loadFailure != null) {
          throw firstPageResponse.loadFailure;
        }

        const validations = firstPageResponse.data ?? [];
        const totalCount = firstPageResponse.indexTotal ?? 0;

        setTotal(totalCount);

        if (totalCount === 0) {
          setAllValidations([]);
          return [];
        }

        if (totalCount <= ALL_VALIDATIONS_PAGE_SIZE) {
          setAllValidations(validations);
          return validations;
        }

        const totalPages = Math.ceil(totalCount / ALL_VALIDATIONS_PAGE_SIZE);
        let allFetchedValidations = [...validations];

        for (let pageNumber = 2; pageNumber <= totalPages; pageNumber++) {
          const pageResponse = await loadConnection(siteValidationConnection, {
            siteUuid,
            criteriaId,
            pageSize: ALL_VALIDATIONS_PAGE_SIZE,
            pageNumber: pageNumber,
            enabled: true
          });

          if (pageResponse.loadFailure) {
            throw pageResponse.loadFailure;
          }

          allFetchedValidations.push(...(pageResponse.data ?? []));
        }

        setAllValidations(allFetchedValidations);
        return allFetchedValidations;
      } catch (e: any) {
        return [];
      }
    },
    [siteUuid, criteriaId]
  );

  return {
    allValidations,
    fetchAllValidationPages,
    total
  };
};

const createPolygonValidationConnection = v3Resource("validations", createPolygonValidations)
  .create<ValidationDto>()
  .buildConnection();

export const createPolygonValidation = resourceCreator(createPolygonValidationConnection);
