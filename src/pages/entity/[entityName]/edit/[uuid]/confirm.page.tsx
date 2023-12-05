import { useT } from "@transifex/react";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { useRouter } from "next/router";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { GetV2FormsENTITYUUIDResponse, useGetV2ENTITYUUID, useGetV2FormsENTITYUUID } from "@/generated/apiComponents";
import { getEntityDetailPageLink } from "@/helpers/entity";
import { EntityName } from "@/types/common";

/* Todo: To select actions and their copies based on form's parent(application, project, site, etc) in 2.4 */
const ConfirmPage = () => {
  const t = useT();
  const router = useRouter();
  const entityName = router.query.entityName as EntityName;
  const entityUUID = router.query.uuid as string;

  const { data, isLoading } = useGetV2FormsENTITYUUID({
    pathParams: { entity: entityName, uuid: entityUUID }
  });

  const { data: entityData } = useGetV2ENTITYUUID({
    pathParams: { entity: entityName, uuid: entityUUID }
  });
  //@ts-ignore
  const entity = (entityData?.data || {}) as any;
  //@ts-ignore
  const formData = (data?.data || {}) as GetV2FormsENTITYUUIDResponse;

  const callToActionMapping: { [index: string]: IButtonProps[] } = {
    projects: [{ children: t("View Project"), href: `/project/${entityUUID}` }],
    sites: [
      {
        variant: "secondary",
        children: t("Add Another Site"),
        href: `/entity/sites/create/${entity.framework_uuid}?parent_name=projects&parent_uuid=${entity.project?.uuid}`
      },
      { children: t("View Site"), href: getEntityDetailPageLink("sites", entityUUID) }
    ],
    nurseries: [
      {
        variant: "secondary",
        children: t("Add Another Nursery"),
        href: `/entity/nurseries/create/${entity.framework_uuid}?parent_name=projects&parent_uuid=${entity.project?.uuid}`
      },
      { children: t("View Nursery"), href: getEntityDetailPageLink("nurseries", entityUUID) }
    ],
    "project-reports": [
      {
        variant: "secondary",
        children: t("View Report"),
        href: getEntityDetailPageLink("project-reports", entityUUID)
      },
      {
        children: t("Back to reporting tasks"),
        href: `/project/${entity.project?.uuid}/reporting-task/${entity.task_uuid}`
      }
    ],
    "site-reports": [
      { children: t("View Report"), href: getEntityDetailPageLink("site-reports", entityUUID) },
      {
        children: t("Back to reporting tasks"),
        href: `/project/${entity.project?.uuid}/reporting-task/${entity.task_uuid}`
      }
    ],
    "nursery-reports": [
      { children: t("View Report"), href: getEntityDetailPageLink("nursery-reports", entityUUID) },
      {
        children: t("Back to reporting tasks"),
        href: `/project/${entity.project?.uuid}/reporting-task/${entity.task_uuid}`
      }
    ]
  };

  const callToActions = callToActionMapping[entityName];

  return (
    <BackgroundLayout>
      <ContentLayout>
        <div className="w-full rounded-lg border-2 border-neutral-100 bg-white p-15">
          <LoadingContainer loading={isLoading}>
            <Icon name={IconNames.CHECK_CIRCLE} className="m-auto mb-8 stroke-secondary-500" width={60} />
            <div
              className="with-inner-html"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(formData.form?.submission_message || "")
              }}
            />
            <div className="mt-15 flex w-full justify-between">
              {callToActions.map(props => (
                <Button key={props.title} as={Link} {...props} />
              ))}
            </div>
          </LoadingContainer>
        </div>
      </ContentLayout>
    </BackgroundLayout>
  );
};

export default ConfirmPage;
