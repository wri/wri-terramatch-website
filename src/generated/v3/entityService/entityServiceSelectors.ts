import { isFetchingSelector, fetchFailedSelector, indexMetaSelector } from "../utils";
import { ResourceType } from "@/store/apiSlice";
import {
  TaskIndexQueryParams,
  TaskIndexVariables,
  TaskGetPathParams,
  TaskGetVariables,
  EntityIndexPathParams,
  EntityIndexQueryParams,
  EntityIndexVariables,
  EntityGetPathParams,
  EntityGetVariables,
  EntityDeletePathParams,
  EntityDeleteVariables,
  EntityUpdatePathParams,
  EntityUpdateVariables,
  EntityAssociationIndexPathParams,
  EntityAssociationIndexQueryParams,
  EntityAssociationIndexVariables,
  TreeScientificNamesSearchQueryParams,
  TreeScientificNamesSearchVariables,
  EstablishmentTreesFindPathParams,
  EstablishmentTreesFindVariables,
  TreeReportCountsFindPathParams,
  TreeReportCountsFindVariables
} from "./entityServiceComponents";

export const taskIndexIsFetching = (variables: Omit<TaskIndexVariables, "body">) =>
  isFetchingSelector<TaskIndexQueryParams, {}>({ url: "/entities/v3/tasks", method: "get", ...variables });

export const taskIndexFetchFailed = (variables: Omit<TaskIndexVariables, "body">) =>
  fetchFailedSelector<TaskIndexQueryParams, {}>({ url: "/entities/v3/tasks", method: "get", ...variables });

export const taskIndexIndexMeta = (resource: ResourceType, variables: Omit<TaskIndexVariables, "body">) =>
  indexMetaSelector<TaskIndexQueryParams, {}>({ url: "/entities/v3/tasks", resource, ...variables });

export const taskGetIsFetching = (variables: Omit<TaskGetVariables, "body">) =>
  isFetchingSelector<{}, TaskGetPathParams>({ url: "/entities/v3/tasks/{uuid}", method: "get", ...variables });

export const taskGetFetchFailed = (variables: Omit<TaskGetVariables, "body">) =>
  fetchFailedSelector<{}, TaskGetPathParams>({ url: "/entities/v3/tasks/{uuid}", method: "get", ...variables });

export const entityIndexIsFetching = (variables: Omit<EntityIndexVariables, "body">) =>
  isFetchingSelector<EntityIndexQueryParams, EntityIndexPathParams>({
    url: "/entities/v3/{entity}",
    method: "get",
    ...variables
  });

export const entityIndexFetchFailed = (variables: Omit<EntityIndexVariables, "body">) =>
  fetchFailedSelector<EntityIndexQueryParams, EntityIndexPathParams>({
    url: "/entities/v3/{entity}",
    method: "get",
    ...variables
  });

export const entityIndexIndexMeta = (resource: ResourceType, variables: Omit<EntityIndexVariables, "body">) =>
  indexMetaSelector<EntityIndexQueryParams, EntityIndexPathParams>({
    url: "/entities/v3/{entity}",
    resource,
    ...variables
  });

export const entityGetIsFetching = (variables: Omit<EntityGetVariables, "body">) =>
  isFetchingSelector<{}, EntityGetPathParams>({ url: "/entities/v3/{entity}/{uuid}", method: "get", ...variables });

export const entityGetFetchFailed = (variables: Omit<EntityGetVariables, "body">) =>
  fetchFailedSelector<{}, EntityGetPathParams>({ url: "/entities/v3/{entity}/{uuid}", method: "get", ...variables });

export const entityDeleteIsFetching = (variables: Omit<EntityDeleteVariables, "body">) =>
  isFetchingSelector<{}, EntityDeletePathParams>({
    url: "/entities/v3/{entity}/{uuid}",
    method: "delete",
    ...variables
  });

export const entityDeleteFetchFailed = (variables: Omit<EntityDeleteVariables, "body">) =>
  fetchFailedSelector<{}, EntityDeletePathParams>({
    url: "/entities/v3/{entity}/{uuid}",
    method: "delete",
    ...variables
  });

export const entityUpdateIsFetching = (variables: Omit<EntityUpdateVariables, "body">) =>
  isFetchingSelector<{}, EntityUpdatePathParams>({
    url: "/entities/v3/{entity}/{uuid}",
    method: "patch",
    ...variables
  });

export const entityUpdateFetchFailed = (variables: Omit<EntityUpdateVariables, "body">) =>
  fetchFailedSelector<{}, EntityUpdatePathParams>({
    url: "/entities/v3/{entity}/{uuid}",
    method: "patch",
    ...variables
  });

export const entityAssociationIndexIsFetching = (variables: Omit<EntityAssociationIndexVariables, "body">) =>
  isFetchingSelector<EntityAssociationIndexQueryParams, EntityAssociationIndexPathParams>({
    url: "/entities/v3/{entity}/{uuid}/{association}",
    method: "get",
    ...variables
  });

export const entityAssociationIndexFetchFailed = (variables: Omit<EntityAssociationIndexVariables, "body">) =>
  fetchFailedSelector<EntityAssociationIndexQueryParams, EntityAssociationIndexPathParams>({
    url: "/entities/v3/{entity}/{uuid}/{association}",
    method: "get",
    ...variables
  });

export const entityAssociationIndexIndexMeta = (
  resource: ResourceType,
  variables: Omit<EntityAssociationIndexVariables, "body">
) =>
  indexMetaSelector<EntityAssociationIndexQueryParams, EntityAssociationIndexPathParams>({
    url: "/entities/v3/{entity}/{uuid}/{association}",
    resource,
    ...variables
  });

export const treeScientificNamesSearchIsFetching = (variables: Omit<TreeScientificNamesSearchVariables, "body">) =>
  isFetchingSelector<TreeScientificNamesSearchQueryParams, {}>({
    url: "/trees/v3/scientificNames",
    method: "get",
    ...variables
  });

export const treeScientificNamesSearchFetchFailed = (variables: Omit<TreeScientificNamesSearchVariables, "body">) =>
  fetchFailedSelector<TreeScientificNamesSearchQueryParams, {}>({
    url: "/trees/v3/scientificNames",
    method: "get",
    ...variables
  });

export const treeScientificNamesSearchIndexMeta = (
  resource: ResourceType,
  variables: Omit<TreeScientificNamesSearchVariables, "body">
) =>
  indexMetaSelector<TreeScientificNamesSearchQueryParams, {}>({
    url: "/trees/v3/scientificNames",
    resource,
    ...variables
  });

export const establishmentTreesFindIsFetching = (variables: Omit<EstablishmentTreesFindVariables, "body">) =>
  isFetchingSelector<{}, EstablishmentTreesFindPathParams>({
    url: "/trees/v3/establishments/{entity}/{uuid}",
    method: "get",
    ...variables
  });

export const establishmentTreesFindFetchFailed = (variables: Omit<EstablishmentTreesFindVariables, "body">) =>
  fetchFailedSelector<{}, EstablishmentTreesFindPathParams>({
    url: "/trees/v3/establishments/{entity}/{uuid}",
    method: "get",
    ...variables
  });

export const treeReportCountsFindIsFetching = (variables: Omit<TreeReportCountsFindVariables, "body">) =>
  isFetchingSelector<{}, TreeReportCountsFindPathParams>({
    url: "/trees/v3/reportCounts/{entity}/{uuid}",
    method: "get",
    ...variables
  });

export const treeReportCountsFindFetchFailed = (variables: Omit<TreeReportCountsFindVariables, "body">) =>
  fetchFailedSelector<{}, TreeReportCountsFindPathParams>({
    url: "/trees/v3/reportCounts/{entity}/{uuid}",
    method: "get",
    ...variables
  });
