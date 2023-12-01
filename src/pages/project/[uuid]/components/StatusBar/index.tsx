import { useGetV2UpdateRequestsENTITYUUID } from "@/generated/apiComponents";
import { pluralEntityNameToSingular } from "@/helpers/entity";
import EntityStatusBar from "@/pages/project/[uuid]/components/StatusBar/EntityStatusBar";
import UpdateRequestStatusBar from "@/pages/project/[uuid]/components/StatusBar/UpdateRequestStatusBar";
import { EntityName } from "@/types/common";

interface EntityStatusBarProps {
  entityName: EntityName;
  entity: any;
}

const StatusBar = ({ entity, entityName }: EntityStatusBarProps) => {
  const { data: updateRequestData } = useGetV2UpdateRequestsENTITYUUID(
    {
      pathParams: {
        entity: pluralEntityNameToSingular(entityName),
        uuid: entity.uuid
      }
    },
    {
      onError() {
        //To override error toast
      }
    }
  );

  //@ts-ignore
  const updateRequest = updateRequestData?.data;

  if (updateRequest) {
    return <UpdateRequestStatusBar entityName={entityName} entityUUID={entity.uuid} updateRequest={updateRequest} />;
  } else {
    return <EntityStatusBar entityName={entityName} entity={entity} />;
  }
};

export default StatusBar;
