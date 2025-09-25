import { notFound } from "next/navigation";
import { useRouter } from "next/router";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { toFramework } from "@/context/framework.provider";
import { GetV2FormsENTITYUUIDResponse, useGetV2ENTITYUUID } from "@/generated/apiComponents";
import { useEntityForm } from "@/hooks/useFormGet";
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

  const { data: entityData, isLoading: getEntityLoading } = useGetV2ENTITYUUID({
    pathParams: { entity: entityName, uuid: entityUUID }
  });
  const entity = entityData?.data ?? {}; //Do not abuse this since forms should stay entity agnostic!

  const { formData: data, isLoading, loadError } = useEntityForm(entityName, entityUUID);
  //@ts-ignore
  const formData = (data?.data ?? {}) as GetV2FormsENTITYUUIDResponse;
  const framework = toFramework(entity.framework_key);

  if (loadError) {
    return notFound();
  }

  return (
    <BackgroundLayout>
      <LoadingContainer loading={isLoading || getEntityLoading}>
        <EditEntityForm {...{ framework, entityName, entityUUID, entity, formData }} />
      </LoadingContainer>
      <PageFooter />
    </BackgroundLayout>
  );
};

export default EditEntityPage;
