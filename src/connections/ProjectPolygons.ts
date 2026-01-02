import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import {
  createProjectPolygon,
  deleteProjectPolygon as deleteProjectPolygonEndpoint,
  getProjectPolygon,
  uploadProjectPolygonFile
} from "@/generated/v3/researchService/researchServiceComponents";
import {
  CreateProjectPolygonAttributesDto,
  ProjectPolygonDto,
  ProjectPolygonUploadAttributesDto
} from "@/generated/v3/researchService/researchServiceSchemas";
import { WithFormData } from "@/generated/v3/utils";
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

export const deleteProjectPolygon = deleterAsync("projectPolygons", deleteProjectPolygonEndpoint, (uuid: string) => ({
  pathParams: { uuid }
}));

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

  ApiSlice.pruneCache("projectPolygons");
  ApiSlice.pruneIndex("projectPolygons", "");

  return response.data?.attributes!;
};

export const createProjectPolygonWithReplace = async (
  attributes: CreateProjectPolygonAttributesDto,
  projectPitchUuid: string
): Promise<ProjectPolygonDto> => {
  const existingPolygon = await loadProjectPolygonByPitch({
    filter: { projectPitchUuid },
    enabled: true
  });

  if (existingPolygon.data?.uuid) {
    await deleteProjectPolygon(existingPolygon.data.uuid);
  }

  return createProjectPolygonResource(attributes);
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

  ApiSlice.pruneCache("projectPolygons");
  ApiSlice.pruneIndex("projectPolygons", "");

  return response.data?.attributes!;
};
