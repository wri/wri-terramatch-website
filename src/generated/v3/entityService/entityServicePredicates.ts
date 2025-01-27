import { isFetching, fetchFailed } from "../utils";
import { ApiDataStore } from "@/store/apiSlice";
import {
  TreeScientificNamesSearchQueryParams,
  TreeScientificNamesSearchVariables,
  EstablishmentTreesFindPathParams,
  EstablishmentTreesFindVariables
} from "./entityServiceComponents";

export const treeScientificNamesSearchIsFetching =
  (variables: Omit<TreeScientificNamesSearchVariables, "body">) => (store: ApiDataStore) =>
    isFetching<TreeScientificNamesSearchQueryParams, {}>({
      store,
      url: "/trees/v3/scientific-names",
      method: "get",
      ...variables
    });

export const treeScientificNamesSearchFetchFailed =
  (variables: Omit<TreeScientificNamesSearchVariables, "body">) => (store: ApiDataStore) =>
    fetchFailed<TreeScientificNamesSearchQueryParams, {}>({
      store,
      url: "/trees/v3/scientific-names",
      method: "get",
      ...variables
    });

export const establishmentTreesFindIsFetching =
  (variables: Omit<EstablishmentTreesFindVariables, "body">) => (store: ApiDataStore) =>
    isFetching<{}, EstablishmentTreesFindPathParams>({
      store,
      url: "/trees/v3/establishments/{entity}/{uuid}",
      method: "get",
      ...variables
    });

export const establishmentTreesFindFetchFailed =
  (variables: Omit<EstablishmentTreesFindVariables, "body">) => (store: ApiDataStore) =>
    fetchFailed<{}, EstablishmentTreesFindPathParams>({
      store,
      url: "/trees/v3/establishments/{entity}/{uuid}",
      method: "get",
      ...variables
    });
