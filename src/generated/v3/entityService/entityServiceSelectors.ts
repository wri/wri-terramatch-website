import { isFetchingSelector, fetchFailedSelector, indexMetaSelector } from "../utils";
import { ResourceType } from "@/store/apiSlice";
import {
  ProjectPitchIndexQueryParams,
  ProjectPitchIndexVariables,
  ProjectPitchGetPathParams,
  ProjectPitchGetVariables,
  ImpactStoryIndexQueryParams,
  ImpactStoryIndexVariables,
  ImpactStoryGetPathParams,
  ImpactStoryGetVariables,
  TaskIndexQueryParams,
  TaskIndexVariables,
  BulkApproveTasksQueryParams,
  BulkApproveTasksVariables,
  TaskGetPathParams,
  TaskGetVariables,
  TaskUpdatePathParams,
  TaskUpdateQueryParams,
  TaskUpdateVariables,
  UploadFilePathParams,
  UploadFileVariables,
  TreeScientificNamesSearchQueryParams,
  TreeScientificNamesSearchVariables,
  EstablishmentTreesFindPathParams,
  EstablishmentTreesFindVariables,
  TreeReportCountsFindPathParams,
  TreeReportCountsFindVariables,
  DemographicsIndexQueryParams,
  DemographicsIndexVariables,
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

export const PROJECT_PITCH_INDEX_URL = "/entities/v3/projectPitches";

export const projectPitchIndexIsFetching = (variables: Omit<ProjectPitchIndexVariables, "body">) =>
  isFetchingSelector<ProjectPitchIndexQueryParams, {}>({ url: PROJECT_PITCH_INDEX_URL, method: "get", ...variables });

export const projectPitchIndexFetchFailed = (variables: Omit<ProjectPitchIndexVariables, "body">) =>
  fetchFailedSelector<ProjectPitchIndexQueryParams, {}>({ url: PROJECT_PITCH_INDEX_URL, method: "get", ...variables });

export const projectPitchIndexIndexMeta = (
  resource: ResourceType,
  variables: Omit<ProjectPitchIndexVariables, "body">
) => indexMetaSelector<ProjectPitchIndexQueryParams, {}>({ url: PROJECT_PITCH_INDEX_URL, resource, ...variables });

export const PROJECT_PITCH_GET_URL = "/entities/v3/projectPitches/{uuid}";

export const projectPitchGetIsFetching = (variables: Omit<ProjectPitchGetVariables, "body">) =>
  isFetchingSelector<{}, ProjectPitchGetPathParams>({ url: PROJECT_PITCH_GET_URL, method: "get", ...variables });

export const projectPitchGetFetchFailed = (variables: Omit<ProjectPitchGetVariables, "body">) =>
  fetchFailedSelector<{}, ProjectPitchGetPathParams>({ url: PROJECT_PITCH_GET_URL, method: "get", ...variables });

export const IMPACT_STORY_INDEX_URL = "/entities/v3/impactStories";

export const impactStoryIndexIsFetching = (variables: Omit<ImpactStoryIndexVariables, "body">) =>
  isFetchingSelector<ImpactStoryIndexQueryParams, {}>({ url: IMPACT_STORY_INDEX_URL, method: "get", ...variables });

export const impactStoryIndexFetchFailed = (variables: Omit<ImpactStoryIndexVariables, "body">) =>
  fetchFailedSelector<ImpactStoryIndexQueryParams, {}>({ url: IMPACT_STORY_INDEX_URL, method: "get", ...variables });

export const impactStoryIndexIndexMeta = (resource: ResourceType, variables: Omit<ImpactStoryIndexVariables, "body">) =>
  indexMetaSelector<ImpactStoryIndexQueryParams, {}>({ url: IMPACT_STORY_INDEX_URL, resource, ...variables });

export const IMPACT_STORY_GET_URL = "/entities/v3/impactStories/{uuid}";

export const impactStoryGetIsFetching = (variables: Omit<ImpactStoryGetVariables, "body">) =>
  isFetchingSelector<{}, ImpactStoryGetPathParams>({ url: IMPACT_STORY_GET_URL, method: "get", ...variables });

export const impactStoryGetFetchFailed = (variables: Omit<ImpactStoryGetVariables, "body">) =>
  fetchFailedSelector<{}, ImpactStoryGetPathParams>({ url: IMPACT_STORY_GET_URL, method: "get", ...variables });

export const TASK_INDEX_URL = "/entities/v3/tasks";

export const taskIndexIsFetching = (variables: Omit<TaskIndexVariables, "body">) =>
  isFetchingSelector<TaskIndexQueryParams, {}>({ url: TASK_INDEX_URL, method: "get", ...variables });

export const taskIndexFetchFailed = (variables: Omit<TaskIndexVariables, "body">) =>
  fetchFailedSelector<TaskIndexQueryParams, {}>({ url: TASK_INDEX_URL, method: "get", ...variables });

export const taskIndexIndexMeta = (resource: ResourceType, variables: Omit<TaskIndexVariables, "body">) =>
  indexMetaSelector<TaskIndexQueryParams, {}>({ url: TASK_INDEX_URL, resource, ...variables });

export const BULK_APPROVE_TASKS_URL = "/entities/v3/tasks";

export const bulkApproveTasksIsFetching = (variables: Omit<BulkApproveTasksVariables, "body">) =>
  isFetchingSelector<BulkApproveTasksQueryParams, {}>({ url: BULK_APPROVE_TASKS_URL, method: "patch", ...variables });

export const bulkApproveTasksFetchFailed = (variables: Omit<BulkApproveTasksVariables, "body">) =>
  fetchFailedSelector<BulkApproveTasksQueryParams, {}>({ url: BULK_APPROVE_TASKS_URL, method: "patch", ...variables });

export const TASK_GET_URL = "/entities/v3/tasks/{uuid}";

export const taskGetIsFetching = (variables: Omit<TaskGetVariables, "body">) =>
  isFetchingSelector<{}, TaskGetPathParams>({ url: TASK_GET_URL, method: "get", ...variables });

export const taskGetFetchFailed = (variables: Omit<TaskGetVariables, "body">) =>
  fetchFailedSelector<{}, TaskGetPathParams>({ url: TASK_GET_URL, method: "get", ...variables });

export const TASK_UPDATE_URL = "/entities/v3/tasks/{uuid}";

export const taskUpdateIsFetching = (variables: Omit<TaskUpdateVariables, "body">) =>
  isFetchingSelector<TaskUpdateQueryParams, TaskUpdatePathParams>({
    url: TASK_UPDATE_URL,
    method: "patch",
    ...variables
  });

export const taskUpdateFetchFailed = (variables: Omit<TaskUpdateVariables, "body">) =>
  fetchFailedSelector<TaskUpdateQueryParams, TaskUpdatePathParams>({
    url: TASK_UPDATE_URL,
    method: "patch",
    ...variables
  });

export const UPLOAD_FILE_URL = "/entities/v3/files/{entity}/{uuid}/{collection}";

export const uploadFileIsFetching = (variables: Omit<UploadFileVariables, "body">) =>
  isFetchingSelector<{}, UploadFilePathParams>({ url: UPLOAD_FILE_URL, method: "post", ...variables });

export const uploadFileFetchFailed = (variables: Omit<UploadFileVariables, "body">) =>
  fetchFailedSelector<{}, UploadFilePathParams>({ url: UPLOAD_FILE_URL, method: "post", ...variables });

export const TREE_SCIENTIFIC_NAMES_SEARCH_URL = "/trees/v3/scientificNames";

export const treeScientificNamesSearchIsFetching = (variables: Omit<TreeScientificNamesSearchVariables, "body">) =>
  isFetchingSelector<TreeScientificNamesSearchQueryParams, {}>({
    url: TREE_SCIENTIFIC_NAMES_SEARCH_URL,
    method: "get",
    ...variables
  });

export const treeScientificNamesSearchFetchFailed = (variables: Omit<TreeScientificNamesSearchVariables, "body">) =>
  fetchFailedSelector<TreeScientificNamesSearchQueryParams, {}>({
    url: TREE_SCIENTIFIC_NAMES_SEARCH_URL,
    method: "get",
    ...variables
  });

export const treeScientificNamesSearchIndexMeta = (
  resource: ResourceType,
  variables: Omit<TreeScientificNamesSearchVariables, "body">
) =>
  indexMetaSelector<TreeScientificNamesSearchQueryParams, {}>({
    url: TREE_SCIENTIFIC_NAMES_SEARCH_URL,
    resource,
    ...variables
  });

export const ESTABLISHMENT_TREES_FIND_URL = "/trees/v3/establishments/{entity}/{uuid}";

export const establishmentTreesFindIsFetching = (variables: Omit<EstablishmentTreesFindVariables, "body">) =>
  isFetchingSelector<{}, EstablishmentTreesFindPathParams>({
    url: ESTABLISHMENT_TREES_FIND_URL,
    method: "get",
    ...variables
  });

export const establishmentTreesFindFetchFailed = (variables: Omit<EstablishmentTreesFindVariables, "body">) =>
  fetchFailedSelector<{}, EstablishmentTreesFindPathParams>({
    url: ESTABLISHMENT_TREES_FIND_URL,
    method: "get",
    ...variables
  });

export const TREE_REPORT_COUNTS_FIND_URL = "/trees/v3/reportCounts/{entity}/{uuid}";

export const treeReportCountsFindIsFetching = (variables: Omit<TreeReportCountsFindVariables, "body">) =>
  isFetchingSelector<{}, TreeReportCountsFindPathParams>({
    url: TREE_REPORT_COUNTS_FIND_URL,
    method: "get",
    ...variables
  });

export const treeReportCountsFindFetchFailed = (variables: Omit<TreeReportCountsFindVariables, "body">) =>
  fetchFailedSelector<{}, TreeReportCountsFindPathParams>({
    url: TREE_REPORT_COUNTS_FIND_URL,
    method: "get",
    ...variables
  });

export const DEMOGRAPHICS_INDEX_URL = "/entities/v3/demographics";

export const demographicsIndexIsFetching = (variables: Omit<DemographicsIndexVariables, "body">) =>
  isFetchingSelector<DemographicsIndexQueryParams, {}>({ url: DEMOGRAPHICS_INDEX_URL, method: "get", ...variables });

export const demographicsIndexFetchFailed = (variables: Omit<DemographicsIndexVariables, "body">) =>
  fetchFailedSelector<DemographicsIndexQueryParams, {}>({ url: DEMOGRAPHICS_INDEX_URL, method: "get", ...variables });

export const demographicsIndexIndexMeta = (
  resource: ResourceType,
  variables: Omit<DemographicsIndexVariables, "body">
) => indexMetaSelector<DemographicsIndexQueryParams, {}>({ url: DEMOGRAPHICS_INDEX_URL, resource, ...variables });

export const ENTITY_INDEX_URL = "/entities/v3/{entity}";

export const entityIndexIsFetching = (variables: Omit<EntityIndexVariables, "body">) =>
  isFetchingSelector<EntityIndexQueryParams, EntityIndexPathParams>({
    url: ENTITY_INDEX_URL,
    method: "get",
    ...variables
  });

export const entityIndexFetchFailed = (variables: Omit<EntityIndexVariables, "body">) =>
  fetchFailedSelector<EntityIndexQueryParams, EntityIndexPathParams>({
    url: ENTITY_INDEX_URL,
    method: "get",
    ...variables
  });

export const entityIndexIndexMeta = (resource: ResourceType, variables: Omit<EntityIndexVariables, "body">) =>
  indexMetaSelector<EntityIndexQueryParams, EntityIndexPathParams>({ url: ENTITY_INDEX_URL, resource, ...variables });

export const ENTITY_GET_URL = "/entities/v3/{entity}/{uuid}";

export const entityGetIsFetching = (variables: Omit<EntityGetVariables, "body">) =>
  isFetchingSelector<{}, EntityGetPathParams>({ url: ENTITY_GET_URL, method: "get", ...variables });

export const entityGetFetchFailed = (variables: Omit<EntityGetVariables, "body">) =>
  fetchFailedSelector<{}, EntityGetPathParams>({ url: ENTITY_GET_URL, method: "get", ...variables });

export const ENTITY_DELETE_URL = "/entities/v3/{entity}/{uuid}";

export const entityDeleteIsFetching = (variables: Omit<EntityDeleteVariables, "body">) =>
  isFetchingSelector<{}, EntityDeletePathParams>({ url: ENTITY_DELETE_URL, method: "delete", ...variables });

export const entityDeleteFetchFailed = (variables: Omit<EntityDeleteVariables, "body">) =>
  fetchFailedSelector<{}, EntityDeletePathParams>({ url: ENTITY_DELETE_URL, method: "delete", ...variables });

export const ENTITY_UPDATE_URL = "/entities/v3/{entity}/{uuid}";

export const entityUpdateIsFetching = (variables: Omit<EntityUpdateVariables, "body">) =>
  isFetchingSelector<{}, EntityUpdatePathParams>({ url: ENTITY_UPDATE_URL, method: "patch", ...variables });

export const entityUpdateFetchFailed = (variables: Omit<EntityUpdateVariables, "body">) =>
  fetchFailedSelector<{}, EntityUpdatePathParams>({ url: ENTITY_UPDATE_URL, method: "patch", ...variables });

export const ENTITY_ASSOCIATION_INDEX_URL = "/entities/v3/{entity}/{uuid}/{association}";

export const entityAssociationIndexIsFetching = (variables: Omit<EntityAssociationIndexVariables, "body">) =>
  isFetchingSelector<EntityAssociationIndexQueryParams, EntityAssociationIndexPathParams>({
    url: ENTITY_ASSOCIATION_INDEX_URL,
    method: "get",
    ...variables
  });

export const entityAssociationIndexFetchFailed = (variables: Omit<EntityAssociationIndexVariables, "body">) =>
  fetchFailedSelector<EntityAssociationIndexQueryParams, EntityAssociationIndexPathParams>({
    url: ENTITY_ASSOCIATION_INDEX_URL,
    method: "get",
    ...variables
  });

export const entityAssociationIndexIndexMeta = (
  resource: ResourceType,
  variables: Omit<EntityAssociationIndexVariables, "body">
) =>
  indexMetaSelector<EntityAssociationIndexQueryParams, EntityAssociationIndexPathParams>({
    url: ENTITY_ASSOCIATION_INDEX_URL,
    resource,
    ...variables
  });
