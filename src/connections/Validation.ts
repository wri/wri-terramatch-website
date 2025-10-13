import { isEmpty } from "lodash";
import { useCallback, useState } from "react";

import { v3Resource } from "@/connections/util/apiConnectionFactory";
import {
  createPolygonValidations,
  createSiteValidation,
  getPolygonValidation,
  GetPolygonValidationPathParams,
  getSiteValidation
} from "@/generated/v3/researchService/researchServiceComponents";
import { DelayedJobDto, ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
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

type CreatePolygonValidationProps = {
  polygonUuids: string[];
  onSuccess?: (data: ValidationDto) => void;
  onError?: (error: any) => void;
};

export const useCreatePolygonValidation = ({ polygonUuids, onSuccess, onError }: CreatePolygonValidationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<ValidationDto | null>(null);

  const mutate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      await createPolygonValidations.fetch({
        body: {
          polygonUuids: polygonUuids
        } as any
      });

      // The API stores the response in Redux, so we need to get it from there
      if (polygonUuids.length === 1) {
        const validationData = ApiSlice.currentState.validations[polygonUuids[0]];
        if (validationData?.attributes) {
          const validationDto = validationData.attributes as ValidationDto;
          setData(validationDto);
          onSuccess?.(validationDto);
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(false);
    } catch (err: any) {
      setError(err);
      setIsLoading(false);
      onError?.(err);
    }
  }, [polygonUuids, onSuccess, onError]);

  return {
    mutate,
    isLoading,
    error,
    data
  };
};

// Mutation connection for creating site validation
type CreateSiteValidationProps = {
  siteUuid: string;
  onSuccess?: (data: DelayedJobDto) => void;
  onError?: (error: any) => void;
};

export const useCreateSiteValidation = ({ siteUuid, onSuccess, onError }: CreateSiteValidationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<DelayedJobDto | null>(null);

  const mutate = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setData(null);

    try {
      await createSiteValidation.fetch({
        pathParams: { siteUuid },
        body: {}
      });

      // The API stores the delayed job in Redux
      const delayedJobs = Object.values(ApiSlice.currentState.delayedJobs || {});
      if (delayedJobs.length > 0) {
        // Find the latest job that matches "Site Polygon Validation" or "Polygon Validation"
        const latestJob = delayedJobs
          .filter(
            job => job.attributes?.name === "Site Polygon Validation" || job.attributes?.name === "Polygon Validation"
          )
          .sort((a, b) => {
            // We don't have a reliable way to sort, just take the first match
            return 0;
          })[0];

        if (latestJob?.attributes) {
          const delayedJobDto = latestJob.attributes as DelayedJobDto;
          setData(delayedJobDto);
          onSuccess?.(delayedJobDto);
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(false);
    } catch (err: any) {
      setError(err);
      setIsLoading(false);
      onError?.(err);
    }
  }, [siteUuid, onSuccess, onError]);

  return {
    mutate,
    isLoading,
    error,
    data
  };
};
