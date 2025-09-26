import { useRouter } from "next/router";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { useGetV2ENTITYUUID } from "@/generated/apiComponents";
import EditEntityForm from "@/pages/entity/[entityName]/edit/[uuid]/EditEntityForm";
import { EntityName } from "@/types/common";

/**
 * Use this page to edit the following entities for a given entity_name and entity_uuid
 * entity_name = projects/sites/nurseries/project-reports/site-reports/nursery-reports
 */
const EditEntityPage = () => {
  const router = useRouter();
  const entityName = router.query.entityName as EntityName;
  const entityUUID = router.query.uuid as string;

  // TODO: Once form submission to entities goes through v3, this can use the v3 entity and
  //  will not be required to be fetched separately.
  const { data: entityData, isLoading: getEntityLoading } = useGetV2ENTITYUUID({
    pathParams: { entity: entityName, uuid: entityUUID }
  });
  const entity = entityData?.data ?? {}; //Do not abuse this since forms should stay entity agnostic!

  return (
    <BackgroundLayout>
      <LoadingContainer loading={getEntityLoading}>
        <EditEntityForm {...{ entityName, entityUUID, entity }} />
      </LoadingContainer>
      <PageFooter />
    </BackgroundLayout>
  );
};

export default EditEntityPage;
