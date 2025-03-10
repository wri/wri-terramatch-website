/**
 * Generated by @openapi-codegen
 *
 * @version 1.0
 */
import type * as Fetcher from "./entityServiceFetcher";
import { entityServiceFetch } from "./entityServiceFetcher";
import type * as Schemas from "./entityServiceSchemas";

export type EntityIndexPathParams = {
  /**
   * Entity type to retrieve
   */
  entity: "projects" | "sites" | "nurseries";
};

export type EntityIndexQueryParams = {
  ["sort[field]"]?: string;
  /**
   * @default ASC
   */
  ["sort[direction]"]?: "ASC" | "DESC";
  /**
   * The size of page being requested
   *
   * @minimum 1
   * @maximum 100
   * @default 100
   */
  ["page[size]"]?: number;
  /**
   * The page number to return. If neither page[after] nor page[number] is provided, the first page is returned. If page[number] is provided, page[size] is required.
   */
  ["page[number]"]?: number;
  search?: string;
  country?: string;
  status?: string;
  updateRequestStatus?: string;
  projectUuid?: string;
};

export type EntityIndexError = Fetcher.ErrorWrapper<{
  status: 400;
  payload: {
    /**
     * @example 400
     */
    statusCode: number;
    /**
     * @example Bad Request
     */
    message: string;
  };
}>;

export type EntityIndexVariables = {
  pathParams: EntityIndexPathParams;
  queryParams?: EntityIndexQueryParams;
};

export const entityIndex = (variables: EntityIndexVariables, signal?: AbortSignal) =>
  entityServiceFetch<
    | {
        meta?: {
          /**
           * @example projects
           */
          type?: string;
          page?: {
            /**
             * The total number of records available.
             *
             * @example 42
             */
            total?: number;
            /**
             * The current page number.
             */
            number?: number;
          };
        };
        data?: {
          /**
           * @example projects
           */
          type?: string;
          /**
           * @format uuid
           */
          id?: string;
          attributes?: Schemas.ProjectLightDto;
        }[];
      }
    | {
        meta?: {
          /**
           * @example sites
           */
          type?: string;
          page?: {
            /**
             * The total number of records available.
             *
             * @example 42
             */
            total?: number;
            /**
             * The current page number.
             */
            number?: number;
          };
        };
        data?: {
          /**
           * @example sites
           */
          type?: string;
          /**
           * @format uuid
           */
          id?: string;
          attributes?: Schemas.SiteLightDto;
        }[];
      }
    | {
        meta?: {
          /**
           * @example nurseries
           */
          type?: string;
          page?: {
            /**
             * The total number of records available.
             *
             * @example 42
             */
            total?: number;
            /**
             * The current page number.
             */
            number?: number;
          };
        };
        data?: {
          /**
           * @example nurseries
           */
          type?: string;
          /**
           * @format uuid
           */
          id?: string;
          attributes?: Schemas.NurseryLightDto;
        }[];
      },
    EntityIndexError,
    undefined,
    {},
    EntityIndexQueryParams,
    EntityIndexPathParams
  >({ url: "/entities/v3/{entity}", method: "get", ...variables, signal });

export type EntityGetPathParams = {
  /**
   * Entity type to retrieve
   */
  entity: "projects" | "sites" | "nurseries";
  /**
   * Entity UUID for resource to retrieve
   */
  uuid: string;
};

export type EntityGetError = Fetcher.ErrorWrapper<
  | {
      status: 401;
      payload: {
        /**
         * @example 401
         */
        statusCode: number;
        /**
         * @example Unauthorized
         */
        message: string;
      };
    }
  | {
      status: 404;
      payload: {
        /**
         * @example 404
         */
        statusCode: number;
        /**
         * @example Not Found
         */
        message: string;
      };
    }
>;

export type EntityGetVariables = {
  pathParams: EntityGetPathParams;
};

export const entityGet = (variables: EntityGetVariables, signal?: AbortSignal) =>
  entityServiceFetch<
    | {
        meta?: {
          /**
           * @example projects
           */
          type?: string;
        };
        data?: {
          /**
           * @example projects
           */
          type?: string;
          /**
           * @format uuid
           */
          id?: string;
          attributes?: Schemas.ProjectFullDto;
        };
      }
    | {
        meta?: {
          /**
           * @example sites
           */
          type?: string;
        };
        data?: {
          /**
           * @example sites
           */
          type?: string;
          /**
           * @format uuid
           */
          id?: string;
          attributes?: Schemas.SiteFullDto;
        };
      }
    | {
        meta?: {
          /**
           * @example nurseries
           */
          type?: string;
        };
        data?: {
          /**
           * @example nurseries
           */
          type?: string;
          /**
           * @format uuid
           */
          id?: string;
          attributes?: Schemas.NurseryFullDto;
        };
      },
    EntityGetError,
    undefined,
    {},
    {},
    EntityGetPathParams
  >({ url: "/entities/v3/{entity}/{uuid}", method: "get", ...variables, signal });

export type EntityAssociationIndexPathParams = {
  /**
   * Entity type for associations
   */
  entity: "projects" | "sites" | "nurseries" | "project-reports" | "site-reports" | "nursery-reports";
  /**
   * Entity UUID for association
   */
  uuid: string;
  /**
   * Association type to retrieve
   */
  association: "demographics";
};

export type EntityAssociationIndexError = Fetcher.ErrorWrapper<
  | {
      status: 400;
      payload: {
        /**
         * @example 400
         */
        statusCode: number;
        /**
         * @example Bad Request
         */
        message: string;
      };
    }
  | {
      status: 404;
      payload: {
        /**
         * @example 404
         */
        statusCode: number;
        /**
         * @example Not Found
         */
        message: string;
      };
    }
>;

export type EntityAssociationIndexResponse = {
  meta?: {
    /**
     * @example demographics
     */
    type?: string;
  };
  data?: {
    /**
     * @example demographics
     */
    type?: string;
    /**
     * @format uuid
     */
    id?: string;
    attributes?: Schemas.DemographicDto;
  };
};

export type EntityAssociationIndexVariables = {
  pathParams: EntityAssociationIndexPathParams;
};

export const entityAssociationIndex = (variables: EntityAssociationIndexVariables, signal?: AbortSignal) =>
  entityServiceFetch<
    EntityAssociationIndexResponse,
    EntityAssociationIndexError,
    undefined,
    {},
    {},
    EntityAssociationIndexPathParams
  >({ url: "/entities/v3/{entity}/{uuid}/{association}", method: "get", ...variables, signal });

export type TreeScientificNamesSearchQueryParams = {
  search: string;
};

export type TreeScientificNamesSearchError = Fetcher.ErrorWrapper<undefined>;

export type TreeScientificNamesSearchResponse = {
  meta?: {
    /**
     * @example treeSpeciesScientificNames
     */
    type?: string;
  };
  data?: {
    /**
     * @example treeSpeciesScientificNames
     */
    type?: string;
    id?: string;
    attributes?: Schemas.ScientificNameDto;
  }[];
};

export type TreeScientificNamesSearchVariables = {
  queryParams: TreeScientificNamesSearchQueryParams;
};

/**
 * Search scientific names of tree species. Returns up to 10 entries.
 */
export const treeScientificNamesSearch = (variables: TreeScientificNamesSearchVariables, signal?: AbortSignal) =>
  entityServiceFetch<
    TreeScientificNamesSearchResponse,
    TreeScientificNamesSearchError,
    undefined,
    {},
    TreeScientificNamesSearchQueryParams,
    {}
  >({ url: "/trees/v3/scientific-names", method: "get", ...variables, signal });

export type EstablishmentTreesFindPathParams = {
  /**
   * Entity type for which to retrieve the establishment tree data.
   */
  entity: "sites" | "nurseries" | "project-reports" | "site-reports" | "nursery-reports";
  /**
   * Entity UUID for which to retrieve the establishment tree data.
   */
  uuid: string;
};

export type EstablishmentTreesFindError = Fetcher.ErrorWrapper<
  | {
      status: 400;
      payload: {
        /**
         * @example 400
         */
        statusCode: number;
        /**
         * @example Bad Request
         */
        message: string;
      };
    }
  | {
      status: 401;
      payload: {
        /**
         * @example 401
         */
        statusCode: number;
        /**
         * @example Unauthorized
         */
        message: string;
      };
    }
>;

export type EstablishmentTreesFindResponse = {
  meta?: {
    /**
     * @example establishmentTrees
     */
    type?: string;
  };
  data?: {
    /**
     * @example establishmentTrees
     */
    type?: string;
    id?: string;
    attributes?: Schemas.EstablishmentsTreesDto;
  };
};

export type EstablishmentTreesFindVariables = {
  pathParams: EstablishmentTreesFindPathParams;
};

export const establishmentTreesFind = (variables: EstablishmentTreesFindVariables, signal?: AbortSignal) =>
  entityServiceFetch<
    EstablishmentTreesFindResponse,
    EstablishmentTreesFindError,
    undefined,
    {},
    {},
    EstablishmentTreesFindPathParams
  >({ url: "/trees/v3/establishments/{entity}/{uuid}", method: "get", ...variables, signal });

export const operationsByTag = {
  entities: { entityIndex, entityGet },
  entityAssociations: { entityAssociationIndex },
  trees: { treeScientificNamesSearch, establishmentTreesFind }
};
