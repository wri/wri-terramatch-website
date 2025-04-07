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
  entity: "projects" | "sites" | "nurseries" | "projectReports" | "nurseryReports" | "siteReports";
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
   * The page number to return. If page[number] is not provided, the first page is returned.
   */
  ["page[number]"]?: number;
  search?: string;
  /**
   * Search query used for filtering selectable options in autocomplete fields.
   */
  searchFilter?: string;
  country?: string;
  status?: string;
  updateRequestStatus?: string;
  projectUuid?: string;
  nurseryUuid?: string;
  siteUuid?: string;
  /**
   * If the base entity supports it, this will load the first page of associated entities
   */
  sideloads?: Schemas.EntitySideload[];
  polygonStatus?: "no-polygons" | "submitted" | "approved" | "needs-more-information" | "draft";
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
          resourceType?: string;
          indices?: {
            /**
             * The resource type for this included index
             */
            resource?: string;
            /**
             * The full stable (sorted query param) request path for this request, suitable for use as a store key in the FE React app
             */
            requestPath?: string;
            /**
             * The total number of records available.
             *
             * @example 42
             */
            total?: number;
            /**
             * The current page number.
             */
            pageNumber?: number;
            /**
             * The ordered set of resource IDs for this page of this index search.
             */
            ids?: string[];
          }[];
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
          resourceType?: string;
          indices?: {
            /**
             * The resource type for this included index
             */
            resource?: string;
            /**
             * The full stable (sorted query param) request path for this request, suitable for use as a store key in the FE React app
             */
            requestPath?: string;
            /**
             * The total number of records available.
             *
             * @example 42
             */
            total?: number;
            /**
             * The current page number.
             */
            pageNumber?: number;
            /**
             * The ordered set of resource IDs for this page of this index search.
             */
            ids?: string[];
          }[];
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
          resourceType?: string;
          indices?: {
            /**
             * The resource type for this included index
             */
            resource?: string;
            /**
             * The full stable (sorted query param) request path for this request, suitable for use as a store key in the FE React app
             */
            requestPath?: string;
            /**
             * The total number of records available.
             *
             * @example 42
             */
            total?: number;
            /**
             * The current page number.
             */
            pageNumber?: number;
            /**
             * The ordered set of resource IDs for this page of this index search.
             */
            ids?: string[];
          }[];
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
      }
    | {
        meta?: {
          /**
           * @example projectReports
           */
          resourceType?: string;
          indices?: {
            /**
             * The resource type for this included index
             */
            resource?: string;
            /**
             * The full stable (sorted query param) request path for this request, suitable for use as a store key in the FE React app
             */
            requestPath?: string;
            /**
             * The total number of records available.
             *
             * @example 42
             */
            total?: number;
            /**
             * The current page number.
             */
            pageNumber?: number;
            /**
             * The ordered set of resource IDs for this page of this index search.
             */
            ids?: string[];
          }[];
        };
        data?: {
          /**
           * @example projectReports
           */
          type?: string;
          /**
           * @format uuid
           */
          id?: string;
          attributes?: Schemas.ProjectReportLightDto;
        }[];
      }
    | {
        meta?: {
          /**
           * @example nurseryReports
           */
          resourceType?: string;
          indices?: {
            /**
             * The resource type for this included index
             */
            resource?: string;
            /**
             * The full stable (sorted query param) request path for this request, suitable for use as a store key in the FE React app
             */
            requestPath?: string;
            /**
             * The total number of records available.
             *
             * @example 42
             */
            total?: number;
            /**
             * The current page number.
             */
            pageNumber?: number;
            /**
             * The ordered set of resource IDs for this page of this index search.
             */
            ids?: string[];
          }[];
        };
        data?: {
          /**
           * @example nurseryReports
           */
          type?: string;
          /**
           * @format uuid
           */
          id?: string;
          attributes?: Schemas.NurseryReportLightDto;
        }[];
      }
    | {
        meta?: {
          /**
           * @example siteReports
           */
          resourceType?: string;
          indices?: {
            /**
             * The resource type for this included index
             */
            resource?: string;
            /**
             * The full stable (sorted query param) request path for this request, suitable for use as a store key in the FE React app
             */
            requestPath?: string;
            /**
             * The total number of records available.
             *
             * @example 42
             */
            total?: number;
            /**
             * The current page number.
             */
            pageNumber?: number;
            /**
             * The ordered set of resource IDs for this page of this index search.
             */
            ids?: string[];
          }[];
        };
        data?: {
          /**
           * @example siteReports
           */
          type?: string;
          /**
           * @format uuid
           */
          id?: string;
          attributes?: Schemas.SiteReportLightDto;
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
  entity: "projects" | "sites" | "nurseries" | "projectReports" | "nurseryReports" | "siteReports";
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
          resourceType?: string;
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
          resourceType?: string;
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
          resourceType?: string;
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
      }
    | {
        meta?: {
          /**
           * @example nurseries
           */
          resourceType?: string;
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
      }
    | {
        meta?: {
          /**
           * @example projectReports
           */
          resourceType?: string;
        };
        data?: {
          /**
           * @example projectReports
           */
          type?: string;
          /**
           * @format uuid
           */
          id?: string;
          attributes?: Schemas.ProjectReportFullDto;
        };
      }
    | {
        meta?: {
          /**
           * @example nurseryReports
           */
          resourceType?: string;
        };
        data?: {
          /**
           * @example nurseryReports
           */
          type?: string;
          /**
           * @format uuid
           */
          id?: string;
          attributes?: Schemas.NurseryReportFullDto;
        };
      }
    | {
        meta?: {
          /**
           * @example siteReports
           */
          resourceType?: string;
        };
        data?: {
          /**
           * @example siteReports
           */
          type?: string;
          /**
           * @format uuid
           */
          id?: string;
          attributes?: Schemas.SiteReportFullDto;
        };
      },
    EntityGetError,
    undefined,
    {},
    {},
    EntityGetPathParams
  >({ url: "/entities/v3/{entity}/{uuid}", method: "get", ...variables, signal });

export type EntityDeletePathParams = {
  /**
   * Entity type to retrieve
   */
  entity: "projects" | "sites" | "nurseries" | "projectReports" | "nurseryReports" | "siteReports";
  /**
   * Entity UUID for resource to retrieve
   */
  uuid: string;
};

export type EntityDeleteError = Fetcher.ErrorWrapper<
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

export type EntityDeleteResponse = {
  meta?: {
    resourceType?: "projects" | "sites";
    /**
     * @format uuid
     */
    resourceId?: string;
  };
};

export type EntityDeleteVariables = {
  pathParams: EntityDeletePathParams;
};

export const entityDelete = (variables: EntityDeleteVariables, signal?: AbortSignal) =>
  entityServiceFetch<EntityDeleteResponse, EntityDeleteError, undefined, {}, {}, EntityDeletePathParams>({
    url: "/entities/v3/{entity}/{uuid}",
    method: "delete",
    ...variables,
    signal
  });

export type EntityAssociationIndexPathParams = {
  /**
   * Entity type for associations
   */
  entity: "projects" | "sites" | "nurseries" | "projectReports" | "siteReports" | "nurseryReports";
  /**
   * Entity UUID for association
   */
  uuid: string;
  /**
   * Association type to retrieve
   */
  association: "demographics" | "seedings" | "treeSpecies";
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

export type EntityAssociationIndexVariables = {
  pathParams: EntityAssociationIndexPathParams;
};

export const entityAssociationIndex = (variables: EntityAssociationIndexVariables, signal?: AbortSignal) =>
  entityServiceFetch<
    | {
        meta?: {
          /**
           * @example demographics
           */
          resourceType?: string;
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
        }[];
      }
    | {
        meta?: {
          /**
           * @example seedings
           */
          resourceType?: string;
        };
        data?: {
          /**
           * @example seedings
           */
          type?: string;
          /**
           * @format uuid
           */
          id?: string;
          attributes?: Schemas.SeedingDto;
        }[];
      }
    | {
        meta?: {
          /**
           * @example treeSpecies
           */
          resourceType?: string;
        };
        data?: {
          /**
           * @example treeSpecies
           */
          type?: string;
          /**
           * @format uuid
           */
          id?: string;
          attributes?: Schemas.TreeSpeciesDto;
        }[];
      },
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
    resourceType?: string;
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
  >({ url: "/trees/v3/scientificNames", method: "get", ...variables, signal });

export type EstablishmentTreesFindPathParams = {
  /**
   * Entity type for which to retrieve the establishment tree data.
   */
  entity: "sites" | "nurseries" | "projectReports" | "siteReports" | "nurseryReports";
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
    resourceType?: string;
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

export type TreeReportCountsFindPathParams = {
  /**
   * Entity type for which to retrieve the associated report count data.
   */
  entity: "projects" | "sites" | "nurseries" | "projectReports" | "siteReports" | "nurseryReports";
  /**
   * Entity UUID for which to retrieve the associated report count data.
   */
  uuid: string;
};

export type TreeReportCountsFindError = Fetcher.ErrorWrapper<
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

export type TreeReportCountsFindResponse = {
  meta?: {
    /**
     * @example treeReportCounts
     */
    resourceType?: string;
  };
  data?: {
    /**
     * @example treeReportCounts
     */
    type?: string;
    id?: string;
    attributes?: Schemas.TreeReportCountsDto;
  };
};

export type TreeReportCountsFindVariables = {
  pathParams: TreeReportCountsFindPathParams;
};

export const treeReportCountsFind = (variables: TreeReportCountsFindVariables, signal?: AbortSignal) =>
  entityServiceFetch<
    TreeReportCountsFindResponse,
    TreeReportCountsFindError,
    undefined,
    {},
    {},
    TreeReportCountsFindPathParams
  >({ url: "/trees/v3/reportCounts/{entity}/{uuid}", method: "get", ...variables, signal });

export const operationsByTag = {
  entities: { entityIndex, entityGet, entityDelete },
  entityAssociations: { entityAssociationIndex },
  trees: { treeScientificNamesSearch, establishmentTreesFind, treeReportCountsFind }
};
