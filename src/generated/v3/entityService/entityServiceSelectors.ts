import { isFetchingSelector, fetchFailedSelector, indexMetaSelector } from "../utils";
import { ResourceType } from "@/store/apiSlice";
import {
  ProjectPitchesIndexQueryParams,
  ProjectPitchesIndexVariables,
  AdminProjectPitchesIndexQueryParams,
  AdminProjectPitchesIndexVariables,
  ProjectPitchesGetUUIDIndexPathParams,
  ProjectPitchesGetUUIDIndexVariables,
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
  EntityAssociationIndexVariables,
  TreeScientificNamesSearchQueryParams,
  TreeScientificNamesSearchVariables,
  EstablishmentTreesFindPathParams,
  EstablishmentTreesFindVariables,
  TreeReportCountsFindPathParams,
  TreeReportCountsFindVariables
} from "./entityServiceComponents";

export const projectPitchesIndexIsFetching = (variables: Omit<ProjectPitchesIndexVariables, "body">) =>
  isFetchingSelector<ProjectPitchesIndexQueryParams, {}>({
    url: "/entities/v3/projectPitches",
    method: "get",
    ...variables
  });

export const projectPitchesIndexFetchFailed = (variables: Omit<ProjectPitchesIndexVariables, "body">) =>
  fetchFailedSelector<ProjectPitchesIndexQueryParams, {}>({
    url: "/entities/v3/projectPitches",
    method: "get",
    ...variables
  });

export const projectPitchesIndexIndexMeta = (
  resource: ResourceType,
  variables: Omit<ProjectPitchesIndexVariables, "body">
) =>
  indexMetaSelector<ProjectPitchesIndexQueryParams, {}>({ url: "/entities/v3/projectPitches", resource, ...variables });

export const adminProjectPitchesIndexIsFetching = (variables: Omit<AdminProjectPitchesIndexVariables, "body">) =>
  isFetchingSelector<AdminProjectPitchesIndexQueryParams, {}>({
    url: "/entities/v3/projectPitches/admin",
    method: "get",
    ...variables
  });

export const adminProjectPitchesIndexFetchFailed = (variables: Omit<AdminProjectPitchesIndexVariables, "body">) =>
  fetchFailedSelector<AdminProjectPitchesIndexQueryParams, {}>({
    url: "/entities/v3/projectPitches/admin",
    method: "get",
    ...variables
  });

export const adminProjectPitchesIndexIndexMeta = (
  resource: ResourceType,
  variables: Omit<AdminProjectPitchesIndexVariables, "body">
) =>
  indexMetaSelector<AdminProjectPitchesIndexQueryParams, {}>({
    url: "/entities/v3/projectPitches/admin",
    resource,
    ...variables
  });

export const projectPitchesGetUUIDIndexIsFetching = (variables: Omit<ProjectPitchesGetUUIDIndexVariables, "body">) =>
  isFetchingSelector<{}, ProjectPitchesGetUUIDIndexPathParams>({
    url: "/entities/v3/projectPitches/{uuid}",
    method: "get",
    ...variables
  });

export const projectPitchesGetUUIDIndexFetchFailed = (variables: Omit<ProjectPitchesGetUUIDIndexVariables, "body">) =>
  fetchFailedSelector<{}, ProjectPitchesGetUUIDIndexPathParams>({
    url: "/entities/v3/projectPitches/{uuid}",
    method: "get",
    ...variables
  });

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
  isFetchingSelector<{}, EntityAssociationIndexPathParams>({
    url: "/entities/v3/{entity}/{uuid}/{association}",
    method: "get",
    ...variables
  });

export const entityAssociationIndexFetchFailed = (variables: Omit<EntityAssociationIndexVariables, "body">) =>
  fetchFailedSelector<{}, EntityAssociationIndexPathParams>({
    url: "/entities/v3/{entity}/{uuid}/{association}",
    method: "get",
    ...variables
  });

export const entityAssociationIndexIndexMeta = (
  resource: ResourceType,
  variables: Omit<EntityAssociationIndexVariables, "body">
) =>
  indexMetaSelector<{}, EntityAssociationIndexPathParams>({
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
