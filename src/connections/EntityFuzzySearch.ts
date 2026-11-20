import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { entityFuzzySearch, EntityFuzzySearchPathParams } from "@/generated/v3/entityService/entityServiceComponents";
import { EntitySearchResultDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useConnection } from "@/hooks/useConnection";

export type EntityFuzzySearchProps = {
  entity: EntityFuzzySearchPathParams["entity"];
  search?: string;
  enabled?: boolean;
};

const entityFuzzySearchConnection = v3Resource("entitySearchResults", entityFuzzySearch)
  .index<EntitySearchResultDto, EntityFuzzySearchProps>(({ entity, search }) => ({
    pathParams: { entity },
    queryParams: { search: (search ?? "").trim() }
  }))
  .enabledProp()
  .buildConnection();

export const useEntityFuzzySearch = ({ entity, search, enabled }: EntityFuzzySearchProps) => {
  const hasSearch = search != null && search.trim() !== "";
  return useConnection(entityFuzzySearchConnection, { entity, search, enabled: enabled !== false && hasSearch });
};
