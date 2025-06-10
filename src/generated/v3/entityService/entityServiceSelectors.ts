import { isFetchingSelector, fetchFailedSelector, indexMetaSelector } from "../utils";
import { ResourceType } from "@/store/apiSlice";
import {
  ProjectPitchIndexQueryParams,
  ProjectPitchIndexVariables,
  ProjectPitchGetPathParams,
  ProjectPitchGetVariables,
  TaskIndexQueryParams,
  TaskIndexVariables,
  TaskGetPathParams,
  TaskGetVariables,
  TaskUpdatePathParams,
  TaskUpdateVariables,
  TreeScientificNamesSearchQueryParams,
  TreeScientificNamesSearchVariables,
  EstablishmentTreesFindPathParams,
  EstablishmentTreesFindVariables,
  TreeReportCountsFindPathParams,
  TreeReportCountsFindVariables,
  BoundingBoxGetQueryParams,
  BoundingBoxGetVariables,
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
  EntityAssociationIndexVariables
} from "./entityServiceComponents";

export const projectPitchIndexIsFetching = (variables: Omit<ProjectPitchIndexVariables, "body">) =>
  isFetchingSelector<ProjectPitchIndexQueryParams, {}>({
    url: "/entities/v3/projectPitches",
    method: "get",
    ...variables
  });

export const projectPitchIndexFetchFailed = (variables: Omit<ProjectPitchIndexVariables, "body">) =>
  fetchFailedSelector<ProjectPitchIndexQueryParams, {}>({
    url: "/entities/v3/projectPitches",
    method: "get",
    ...variables
  });

export const projectPitchIndexIndexMeta = (
  resource: ResourceType,
  variables: Omit<ProjectPitchIndexVariables, "body">
) =>
  indexMetaSelector<ProjectPitchIndexQueryParams, {}>({ url: "/entities/v3/projectPitches", resource, ...variables });

export const projectPitchGetIsFetching = (variables: Omit<ProjectPitchGetVariables, "body">) =>
  isFetchingSelector<{}, ProjectPitchGetPathParams>({
    url: "/entities/v3/projectPitches/{uuid}",
    method: "get",
    ...variables
  });

export const projectPitchGetFetchFailed = (variables: Omit<ProjectPitchGetVariables, "body">) =>
  fetchFailedSelector<{}, ProjectPitchGetPathParams>({
    url: "/entities/v3/projectPitches/{uuid}",
    method: "get",
    ...variables
  });

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

export const taskUpdateIsFetching = (variables: Omit<TaskUpdateVariables, "body">) =>
  isFetchingSelector<{}, TaskUpdatePathParams>({ url: "/entities/v3/tasks/{uuid}", method: "patch", ...variables });

export const taskUpdateFetchFailed = (variables: Omit<TaskUpdateVariables, "body">) =>
  fetchFailedSelector<{}, TaskUpdatePathParams>({ url: "/entities/v3/tasks/{uuid}", method: "patch", ...variables });

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

export const boundingBoxGetIsFetching = (variables: Omit<BoundingBoxGetVariables, "body">) =>
  isFetchingSelector<BoundingBoxGetQueryParams, {}>({ url: "/boundingBoxes/v3/get", method: "get", ...variables });

export const boundingBoxGetFetchFailed = (variables: Omit<BoundingBoxGetVariables, "body">) =>
  fetchFailedSelector<BoundingBoxGetQueryParams, {}>({ url: "/boundingBoxes/v3/get", method: "get", ...variables });

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
