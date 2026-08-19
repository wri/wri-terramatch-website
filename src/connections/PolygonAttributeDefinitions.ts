import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import { resourceCreator, resourceUpdater } from "@/connections/util/resourceMutator";
import {
  polygonAttributeDefinitionCreate,
  polygonAttributeDefinitionDelete,
  polygonAttributeDefinitionGet,
  polygonAttributeDefinitionsIndex,
  PolygonAttributeDefinitionsIndexQueryParams,
  polygonAttributeDefinitionUpdate
} from "@/generated/v3/researchService/researchServiceComponents";
import {
  CreatePolygonAttributeDefinitionAttributes,
  PolygonAttributeDefinitionDto,
  UpdatePolygonAttributeDefinitionAttributes
} from "@/generated/v3/researchService/researchServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import { PendingError } from "@/store/apiSlice";
import { Connected } from "@/types/connection";

const polygonAttributeDefinitionsIndexConnection = v3Resource(
  "polygonAttributeDefinitions",
  polygonAttributeDefinitionsIndex
)
  .index<PolygonAttributeDefinitionDto>()
  .addProps<{ frameworkKey?: string }>(({ frameworkKey }) =>
    frameworkKey == null ? undefined : { queryParams: { frameworkKey } as PolygonAttributeDefinitionsIndexQueryParams }
  )
  .enabledProp()
  .loadFailure()
  .buildConnection();

export const usePolygonAttributeDefinitions = ({
  frameworkKey,
  enabled = true
}: {
  frameworkKey?: string;
  enabled?: boolean;
}): Connected<{ data?: PolygonAttributeDefinitionDto[]; loadFailure?: PendingError }> => {
  const [loaded, { data, loadFailure }] = useConnection(polygonAttributeDefinitionsIndexConnection, {
    enabled: enabled && frameworkKey != null,
    frameworkKey
  });
  return loaded ? [true, { data, loadFailure }] : [false, {}];
};

export const loadPolygonAttributeDefinitions = connectionLoader(polygonAttributeDefinitionsIndexConnection);

const polygonAttributeDefinitionConnection = v3Resource("polygonAttributeDefinitions", polygonAttributeDefinitionGet)
  .singleResource<PolygonAttributeDefinitionDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .enabledProp()
  .update(polygonAttributeDefinitionUpdate)
  .buildConnection();

export const usePolygonAttributeDefinition = (uuid: string | undefined) =>
  useConnection(polygonAttributeDefinitionConnection, { id: uuid });
export const loadPolygonAttributeDefinition = connectionLoader(polygonAttributeDefinitionConnection);
export const updatePolygonAttributeDefinition = resourceUpdater(polygonAttributeDefinitionConnection);

const createPolygonAttributeDefinitionConnection = v3Resource(
  "polygonAttributeDefinitions",
  polygonAttributeDefinitionCreate
)
  .create<PolygonAttributeDefinitionDto>()
  .buildConnection();

export const createPolygonAttributeDefinition = resourceCreator(createPolygonAttributeDefinitionConnection);

export const deletePolygonAttributeDefinition = deleterAsync(
  "polygonAttributeDefinitions",
  polygonAttributeDefinitionDelete,
  uuid => ({ pathParams: { uuid } })
);

export type {
  CreatePolygonAttributeDefinitionAttributes,
  PolygonAttributeDefinitionDto,
  UpdatePolygonAttributeDefinitionAttributes
};
