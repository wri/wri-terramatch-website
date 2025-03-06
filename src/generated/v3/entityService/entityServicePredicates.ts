import { isFetching, fetchFailed } from "../utils";
import { ApiDataStore } from "@/store/apiSlice";
import {
  EntityIndexPathParams,
  EntityIndexQueryParams,
  EntityIndexVariables,
  EntityGetPathParams,
  EntityGetVariables,
  EntityAssociationIndexPathParams,
  EntityAssociationIndexVariables,
  TreeScientificNamesSearchQueryParams,
  TreeScientificNamesSearchVariables,
  EstablishmentTreesFindPathParams,
  EstablishmentTreesFindVariables
} from "./entityServiceComponents";

export const entityIndexIsFetching = (variables: Omit<EntityIndexVariables, "body">) => (store: ApiDataStore) =>
  isFetching<EntityIndexQueryParams, EntityIndexPathParams>({
    store,
    url: "/entities/v3/{entity}",
    method: "get",
    ...variables
  });

export const entityIndexFetchFailed = (variables: Omit<EntityIndexVariables, "body">) => (store: ApiDataStore) =>
  fetchFailed<EntityIndexQueryParams, EntityIndexPathParams>({
    store,
    url: "/entities/v3/{entity}",
    method: "get",
    ...variables
  });

export const entityGetIsFetching = (variables: Omit<EntityGetVariables, "body">) => (store: ApiDataStore) =>
  isFetching<{}, EntityGetPathParams>({ store, url: "/entities/v3/{entity}/{uuid}", method: "get", ...variables });

export const entityGetFetchFailed = (variables: Omit<EntityGetVariables, "body">) => (store: ApiDataStore) =>
  fetchFailed<{}, EntityGetPathParams>({ store, url: "/entities/v3/{entity}/{uuid}", method: "get", ...variables });

export const entityAssociationIndexIsFetching =
  (variables: Omit<EntityAssociationIndexVariables, "body">) => (store: ApiDataStore) =>
    isFetching<{}, EntityAssociationIndexPathParams>({
      store,
      url: "/entities/v3/{entity}/{uuid}/{association}",
      method: "get",
      ...variables
    });

export const entityAssociationIndexFetchFailed =
  (variables: Omit<EntityAssociationIndexVariables, "body">) => (store: ApiDataStore) =>
    fetchFailed<{}, EntityAssociationIndexPathParams>({
      store,
      url: "/entities/v3/{entity}/{uuid}/{association}",
      method: "get",
      ...variables
    });

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
