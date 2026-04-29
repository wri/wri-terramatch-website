import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import {
  createProjectPolygon,
  deleteProjectPolygon as deleteProjectPolygonEndpoint,
  getProjectPolygon,
  updateProjectPolygon,
  uploadProjectPolygonFile
} from "@/generated/v3/researchService/researchServiceComponents";
import {
  CreateProjectPolygonAttributesDto,
  ProjectPolygonDto,
  ProjectPolygonUploadAttributesDto,
  UpdateProjectPolygonAttributesDto
} from "@/generated/v3/researchService/researchServiceSchemas";
import { resolveUrl, WithFormData } from "@/generated/v3/utils";
import ApiSlice from "@/store/apiSlice";
import { parallelRequestHook } from "@/utils/parallelRequestHook";

const createProjectPolygonConnection = v3Resource("projectPolygons", createProjectPolygon)
  .create<ProjectPolygonDto, CreateProjectPolygonAttributesDto>()
  .refetch(() => {
    ApiSlice.pruneCache("projectPolygons");
    ApiSlice.pruneIndex("projectPolygons", "");
  })
  .buildConnection();

export const useCreateProjectPolygon = connectionHook(createProjectPolygonConnection);
export const loadCreateProjectPolygon = connectionLoader(createProjectPolygonConnection);

const getProjectPolygonConnection = v3Resource("projectPolygons", getProjectPolygon)
  .singleByFilter<ProjectPolygonDto, { projectPitchUuid?: string }>(props => ({
    queryParams: props.filter
  }))
  .enabledProp()
  .isLoading()
  .refetch((props, variablesFactory) => {
    const variables = variablesFactory(props);
    if (variables?.queryParams) {
      ApiSlice.pruneCache("projectPolygons");
    }
  })
  .buildConnection();

export const useProjectPolygonByPitch = connectionHook(getProjectPolygonConnection);
export const loadProjectPolygonByPitch = connectionLoader(getProjectPolygonConnection);

const deleteProjectPolygonBase = deleterAsync("projectPolygons", deleteProjectPolygonEndpoint, (polyUuid: string) => ({
  pathParams: { polyUuid }
}));

const clearProjectPolygonGetPending = (projectPitchUuid: string | null | undefined): void => {
  if (projectPitchUuid == null) return;

  const getUrl = resolveUrl(getProjectPolygon.url, {
    queryParams: { projectPitchUuid }
  });
  ApiSlice.clearPending(getUrl, "GET");
};

const pruneProjectPolygonCaches = (options?: { projectPitchUuid?: string; includeBoundingBoxes?: boolean }): void => {
  ApiSlice.pruneCache("projectPolygons");
  ApiSlice.pruneIndex("projectPolygons", "");
  ApiSlice.pruneCache("geojsonExports", options?.projectPitchUuid != null ? [options.projectPitchUuid] : undefined);
  if (options?.includeBoundingBoxes) {
    ApiSlice.pruneCache("boundingBoxes");
  }
};

export const deleteProjectPolygon = async (polyUuid: string): Promise<void> => {
  await deleteProjectPolygonBase(polyUuid);
  pruneProjectPolygonCaches({ includeBoundingBoxes: true });
};

export const useUploadProjectPolygonFile = parallelRequestHook("projectPolygons", uploadProjectPolygonFile);

export const createProjectPolygonResource = async (
  attributes: CreateProjectPolygonAttributesDto
): Promise<ProjectPolygonDto> => {
  const response = await createProjectPolygon.fetchParallel({
    body: {
      data: {
        type: "projectPolygons",
        attributes
      }
    }
  });

  const result = response.data?.attributes!;

  pruneProjectPolygonCaches();
  clearProjectPolygonGetPending(result.projectPitchUuid);

  return result;
};

export const createProjectPolygonWithReplace = async (
  attributes: CreateProjectPolygonAttributesDto,
  projectPitchUuid: string
): Promise<ProjectPolygonDto> => {
  const existingPolygon = await loadProjectPolygonByPitch({
    filter: { projectPitchUuid },
    enabled: true
  });

  if (existingPolygon.data?.polygonUuid) {
    await deleteProjectPolygonBase(existingPolygon.data.polygonUuid);
  }

  const result = await createProjectPolygonResource(attributes);
  ApiSlice.pruneCache("geojsonExports", [projectPitchUuid]);

  return result;
};

export const prepareProjectPolygonForUpload = (
  file: File,
  projectPitchUuid: string
): WithFormData<ProjectPolygonUploadAttributesDto> => {
  const formData = new FormData();
  formData.append("file", file);
  return { projectPitchUuid, formData };
};

export const uploadProjectPolygonFileResource = async (
  projectPitchUuid: string,
  file: File
): Promise<ProjectPolygonDto> => {
  const attributes = prepareProjectPolygonForUpload(file, projectPitchUuid);

  const response = await uploadProjectPolygonFile.fetchParallel({
    body: {
      data: {
        type: "projectPolygons",
        attributes
      }
    }
  });

  pruneProjectPolygonCaches({ projectPitchUuid, includeBoundingBoxes: true });

  clearProjectPolygonGetPending(projectPitchUuid);

  return response.data?.attributes!;
};

export const updateProjectPolygonResource = async (
  polyUuid: string,
  attributes: UpdateProjectPolygonAttributesDto
): Promise<void> => {
  await updateProjectPolygon.fetch({
    pathParams: { polyUuid },
    body: {
      data: {
        type: "projectPolygons",
        id: polyUuid,
        attributes
      }
    }
  });

  pruneProjectPolygonCaches({ includeBoundingBoxes: true });
};
