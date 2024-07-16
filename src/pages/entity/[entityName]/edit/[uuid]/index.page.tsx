import { notFound } from "next/navigation";
import { useRouter } from "next/router";

import PageFooter from "@/components/extensive/PageElements/Footer/PageFooter";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import FrameworkProvider from "@/context/framework.provider";
import { GetV2FormsENTITYUUIDResponse, useGetV2ENTITYUUID, useGetV2FormsENTITYUUID } from "@/generated/apiComponents";
import { EditEntityForm } from "@/pages/entity/[entityName]/edit/[uuid]/EditEntityForm";
import { EntityName } from "@/types/common";

/**
 * Use this page to edit the following entities for a given entity_name and entity_uuid
 * entity_name = projects/sites/nurseries/project-reports/site-reports/nursery-reports
 */
const EditEntityPage = () => {
  const router = useRouter();
  const entityName = router.query.entityName as EntityName;
  const entityUUID = router.query.uuid as string;

  const { data: entityData } = useGetV2ENTITYUUID({
    pathParams: { entity: entityName, uuid: entityUUID }
  });
  const entity = entityData?.data ?? {}; //Do not abuse this since forms should stay entity agnostic!

  const { data, isLoading, isError } = useGetV2FormsENTITYUUID({
    pathParams: { entity: entityName, uuid: entityUUID },
    queryParams: { lang: router.locale }
  });
  //@ts-ignore
  const formData = (data?.data ?? {}) as GetV2FormsENTITYUUIDResponse;

  if (isError) {
    return notFound();
  }

  return (
    <BackgroundLayout>
      <FrameworkProvider frameworkKey={entity.framework_key}>
        <LoadingContainer loading={isLoading}>
          <EditEntityForm {...{ entityName, entityUUID, entity, formData }} />
        </LoadingContainer>
        <br />
        <PageFooter />
      </FrameworkProvider>
    </BackgroundLayout>
  );
};

export default EditEntityPage;
