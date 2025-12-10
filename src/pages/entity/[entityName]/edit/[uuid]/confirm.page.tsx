import { useT } from "@transifex/react";
import DOMPurify from "isomorphic-dompurify";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo } from "react";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import BackgroundLayout from "@/components/generic/Layout/BackgroundLayout";
import ContentLayout from "@/components/generic/Layout/ContentLayout";
import LoadingContainer from "@/components/generic/Loading/LoadingContainer";
import { EntityFullDto, useFullEntity } from "@/connections/Entity";
import { FormEntity } from "@/connections/Form";
import {
  FinancialReportFullDto,
  NurseryFullDto,
  NurseryReportFullDto,
  ProjectReportFullDto,
  SiteFullDto,
  SiteReportFullDto,
  SrpReportFullDto
} from "@/generated/v3/entityService/entityServiceSchemas";
import { getEntityDetailPageLink, v3EntityName } from "@/helpers/entity";
import { useEntityForm } from "@/hooks/useFormGet";
import { EntityName } from "@/types/common";

const getCallToAction = (
  entityName: FormEntity,
  entity: EntityFullDto | undefined,
  t: typeof useT
): IButtonProps[] | undefined => {
  if (entity == null) return undefined;

  switch (entityName) {
    case "projects":
      return [{ children: t("View Project"), href: `/project/${entity.uuid}` }];
    case "sites": {
      const site = entity as SiteFullDto;
      return [
        {
          variant: "secondary",
          children: t("Add Another Site"),
          href: `/entity/sites/create/${site.frameworkKey}?parent_name=projects&parent_uuid=${site.projectUuid}`
        },
        { children: t("View Site"), href: getEntityDetailPageLink("sites", site.uuid) }
      ];
    }
    case "nurseries": {
      const nursery = entity as NurseryFullDto;
      return [
        {
          variant: "secondary",
          children: t("Add Another Nursery"),
          href: `/entity/nurseries/create/${nursery.frameworkKey}?parent_name=projects&parent_uuid=${nursery.projectUuid}`
        },
        { children: t("View Nursery"), href: getEntityDetailPageLink("nurseries", nursery.uuid) }
      ];
    }
    case "projectReports": {
      const report = entity as ProjectReportFullDto;
      return [
        {
          variant: "secondary",
          children: t("View Report"),
          href: getEntityDetailPageLink("project-reports", report.uuid)
        },
        {
          children: t("Back to reporting tasks"),
          href: `/project/{report.projectUuid}/reporting-task/${report.taskUuid}`
        }
      ];
    }
    case "siteReports": {
      const report = entity as SiteReportFullDto;
      return [
        { children: t("View Report"), href: getEntityDetailPageLink("site-reports", report.uuid) },
        {
          children: t("Back to reporting tasks"),
          href: `/project/${report.projectUuid}/reporting-task/${report.taskUuid}`
        }
      ];
    }
    case "nurseryReports": {
      const report = entity as NurseryReportFullDto;
      return [
        { children: t("View Report"), href: getEntityDetailPageLink("nursery-reports", report.uuid) },
        {
          children: t("Back to reporting tasks"),
          href: `/project/${report.projectUuid}/reporting-task/${report.taskUuid}`
        }
      ];
    }
    case "financialReports": {
      const report = entity as FinancialReportFullDto;
      return [
        { children: t("View Report"), href: getEntityDetailPageLink("financial-reports", report.uuid) },
        {
          children: t("Back to organization"),
          href: `/organization/${report.organisationUuid}?tab=financial_information`
        }
      ];
    }
    case "disturbanceReports": {
      const report = entity as FinancialReportFullDto;
      return [
        { children: t("View Report"), href: getEntityDetailPageLink("disturbance-reports", report.uuid) },
        {
          children: t("Back to organization"),
          href: `/organization/${report.organisationUuid}?tab=disturbance_information`
        }
      ];
    }
    case "srpReports": {
      const report = entity as SrpReportFullDto;
      return [
        { children: t("View Report"), href: getEntityDetailPageLink("srp-reports", report.uuid) },
        {
          children: t("Back to reporting tasks"),
          href: `/project/${report.projectUuid}/reporting-task/${report.taskUuid}`
        }
      ];
    }
  }
};

const ConfirmPage = () => {
  const t = useT();
  const router = useRouter();
  const entityName = router.query.entityName as EntityName;
  const entityUUID = router.query.uuid as string;

  const { form, isLoading } = useEntityForm(v3EntityName(entityName) as FormEntity, entityUUID);

  const formEntity = v3EntityName(entityName) as FormEntity;
  const [entityLoaded, { data: entity }] = useFullEntity(formEntity, entityUUID);
  const callToActions = useMemo(() => getCallToAction(formEntity, entity, t), [entity, formEntity, t]);

  return (
    <BackgroundLayout>
      <ContentLayout>
        <div className="w-full rounded-lg border-2 border-neutral-100 bg-white p-15">
          <LoadingContainer loading={isLoading || !entityLoaded}>
            <Icon name={IconNames.CHECK_CIRCLE} className="m-auto mb-8 stroke-secondary-500" width={60} />
            <div
              className="with-inner-html"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(form?.submissionMessage ?? "")
              }}
            />
            <div className="mt-15 flex w-full justify-between">
              {callToActions?.map(props => (
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
