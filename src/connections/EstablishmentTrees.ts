import { establishmentTreesFind } from "@/generated/v3/entityService/entityServiceComponents";
import { TreeEntityTypes } from "@/generated/v3/entityService/entityServiceConstants";
import { EstablishmentsTreesDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useConnection } from "@/hooks/useConnection";

import { v3Endpoint } from "./util/apiConnectionFactory";

export type EstablishmentEntity = (typeof TreeEntityTypes.ESTABLISHMENT_ENTITIES)[number];

type EstablishmentTreesProps = {
  entity?: EstablishmentEntity;
  uuid?: string;
};

const establishmentTreesConnection = v3Endpoint("establishmentTrees", establishmentTreesFind)
  .singleByCustomId<EstablishmentsTreesDto, EstablishmentTreesProps>(
    ({ entity, uuid }) => (entity == null || uuid == null ? undefined : { pathParams: { entity, uuid } }),
    ({ entity, uuid }) => `${entity}|${uuid}`
  )
  .enabledProp()
  .buildConnection();

export const useEstablishmentTrees = ({
  entity,
  uuid,
  collection
}: EstablishmentTreesProps & { collection?: string }) => {
  const enabled =
    collection != null && entity != null && uuid != null && TreeEntityTypes.ESTABLISHMENT_ENTITIES.includes(entity);
  const [isLoaded, { data }] = useConnection(establishmentTreesConnection, { entity, uuid, enabled });
  return {
    isLoaded,
    establishmentTrees: collection == null ? undefined : data?.establishmentTrees?.[collection],
    previousPlantingCounts: collection == null ? undefined : data?.previousPlantingCounts?.[collection]
  };
};
