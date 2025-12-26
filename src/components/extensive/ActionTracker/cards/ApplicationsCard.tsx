import { useT } from "@transifex/react";
import { last } from "lodash";
import Link from "next/link";
import { useMemo } from "react";

import { ApplicationDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useDate } from "@/hooks/useDate";
import { isNotNull } from "@/utils/array";

import { IconNames } from "../../Icon/Icon";
import ActionTrackerCard, { getActionCardStatusMapper } from "../ActionTrackerCard";
import { ActionTrackerCardRowProps } from "../ActionTrackerCardRow";

export type ApplicationsCardProps = {
  applications: ApplicationDto[];
};

const ApplicationsCard = (props: ApplicationsCardProps) => {
  const t = useT();
  const { format } = useDate();

  const applications = useMemo(
    () =>
      props.applications
        .map(application => {
          const currentSubmission = last(application.submissions);
          if (currentSubmission?.status == null) return undefined;

          return {
            ...getActionCardStatusMapper(t)[currentSubmission.status],
            ctaLink: `applications/${application.uuid}`,
            ctaText: t("View Application"),
            title: application.fundingProgrammeName ?? t("N/A"),
            subtitle: t(`<strong>Stage</strong>: {name}`, {
              name: currentSubmission.stageName ?? t("N/A")
            }),
            updatedAt: t(`<strong>Last Updated</strong>: {date}`, {
              date: format(currentSubmission.updatedAt)
            }),
            updatedBy: t(`<strong>Updated By</strong>: {name}`, { name: currentSubmission.updatedByName })
          } as ActionTrackerCardRowProps;
        })
        .filter(isNotNull),
    [format, props.applications, t]
  );

  return (
    <ActionTrackerCard
      data={applications}
      title={t("Applications")}
      subtitle={applications.length && t("You have {n} updates", { n: applications.length })}
      icon={IconNames.DOCUMENT_CIRCLE}
      emptyState={{
        title: t("Track your applications"),
        subtitle: t(
          "You will find the updates to your funding opportunity applications here. If you are looking for funding opportunities, click the button below."
        ),
        buttonProps: {
          as: Link,
          href: "/opportunities",
          children: t("View opportunities")
        }
      }}
    />
  );
};

export default ApplicationsCard;
