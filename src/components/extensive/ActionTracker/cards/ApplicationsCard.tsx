import { useT } from "@transifex/react";
import Link from "next/link";
import { useMemo } from "react";

import { ApplicationLiteRead } from "@/generated/apiSchemas";

import { IconNames } from "../../Icon/Icon";
import ActionTrackerCard from "../ActionTrackerCard";
import { ActionTrackerCardRowProps } from "../ActionTrackerCardRow";

export type ApplicationsCardProps = {
  applications?: ApplicationLiteRead[];
};

export const getActionCardStatusMapper = (t: typeof useT): { [index: string]: Partial<ActionTrackerCardRowProps> } => ({
  started: {
    status: "edit",
    statusText: t("Draft")
  },
  rejected: {
    status: "error",
    statusText: t("Rejected")
  },
  approved: {
    status: "success",
    statusText: t("Approved")
  },
  "awaiting-approval": {
    statusText: t("Awaiting Review"),
    status: "awaiting"
  },
  "requires-more-information": {
    statusText: t("More info requested"),
    status: "warning"
  }
});

const ApplicationsCard = (props: ApplicationsCardProps) => {
  const t = useT();

  const applications = useMemo(() => {
    if (!props.applications) return [];

    return props.applications
      .filter(application => !!application.current_submission?.status)
      .map(application => {
        const applicationStatus = application.current_submission?.status;

        return {
          ...getActionCardStatusMapper(t)[applicationStatus!],
          ctaLink: `applications/${application.uuid}`,
          ctaText: t("View Application"),
          title: application.funding_programme_name ?? t("N/A"),
          subtitle: t(`<strong>Stage</strong>: {name}`, {
            name: application.current_submission?.stage?.name || t("N/A")
          })
        } as ActionTrackerCardRowProps;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.applications]);

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
