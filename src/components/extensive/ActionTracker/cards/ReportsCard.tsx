import { useT } from "@transifex/react";
import Link from "next/link";
import { useMemo } from "react";

import {
  GetV2MyActionsResponse,
  GetV2MyProjectsResponse,
  useGetV2MyProjects,
  usePutV2MyActionsUUIDComplete
} from "@/generated/apiComponents";
import { getEntityCombinedStatus, getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import { sortByDate } from "@/utils/sort";

import { IconNames } from "../../Icon/Icon";
import ActionTrackerCard, { getActionCardStatusMapper } from "../ActionTrackerCard";
import { ActionTrackerCardRowProps } from "../ActionTrackerCardRow";

export type ReportsCardProps = {
  actions?: GetV2MyActionsResponse["data"];
};

const ReportsCard = ({ actions }: ReportsCardProps) => {
  const t = useT();

  const { mutate: clearAction } = usePutV2MyActionsUUIDComplete();
  const { data: projects } = useGetV2MyProjects<{ data: GetV2MyProjectsResponse }>({});
  const { format } = useDate();

  const reportActions = useMemo(() => {
    if (!actions) return [];

    return sortByDate(actions, "target.due_at")
      .filter(action => !!action.target)
      .map(action => {
        const target = action.target;
        // Project is either the target itself or, if it has a project object, it is that.
        const project = action.target?.project ?? action.target;
        const type = action.targetable_type;
        const status = getEntityCombinedStatus(target);
        // When true, the action is cleared on the client side when the user clicks it, otherwise this is handled BED side.
        let canClearActionClientSide = status === "approved" || status === "rejected";

        let dueText = t("<strong>Due:</strong> {date}", { date: format(target?.due_at) });
        let subtitle;
        let ctaText;
        let ctaLink;

        switch (type) {
          case "ProjectReport": {
            ctaText = t("View Project Report");
            subtitle = action.text;

            if (status?.includes("due")) {
              ctaLink = `/project/${target?.project.uuid}/reporting-task/${target?.task_uuid}`;
            } else ctaLink = getEntityDetailPageLink("project-reports", target?.uuid);
            break;
          }
          case "NurseryReport": {
            ctaText = t("View Nursery Report");
            subtitle = t("<strong>Nursery:</strong> {name}", { name: target?.name });

            if (status?.includes("due")) {
              ctaLink = `/project/${target?.project.uuid}/reporting-task/${target?.task_uuid}`;
            } else ctaLink = `reports/nursery-report/${target?.uuid}`;
            break;
          }
          case "SiteReport": {
            ctaText = t("View Site Report");
            subtitle = t("<strong>Site:</strong> {name}", { name: target?.name });

            if (status?.includes("due")) {
              ctaLink = `/project/${target?.project.uuid}/reporting-task/${target?.task_uuid}`;
            } else ctaLink = `reports/site-report/${target?.uuid}`;
          }
        }

        return {
          ...getActionCardStatusMapper(t)[status!],
          ctaLink,
          ctaText,
          title: project?.name,
          subtitle: `${subtitle ? `${subtitle}\n` : ""}${target?.due_at ? dueText : ""}`,
          onClick: () => {
            canClearActionClientSide && action.uuid && clearAction({ pathParams: { uuid: action.uuid } });
          }
        } as ActionTrackerCardRowProps;
      });
  }, [actions, format, clearAction, t]);

  return (
    <ActionTrackerCard
      data={reportActions}
      title={t("Reports")}
      subtitle={reportActions.length && t("You have {n} updates", { n: reportActions.length })}
      icon={IconNames.ARROW_SPIN_CIRCLE}
      limit={10}
      emptyState={{
        title: t("Track your reporting tasks"),
        subtitle: t(
          "You will find the updates to your reporting tasks here. To view your reports, click the button below."
        ),
        buttonProps: {
          as: Link,
          href: "/my-projects",
          children: t("View my reports")
        }
      }}
      cta={
        reportActions.length > 10
          ? {
              as: Link,
              href:
                (projects?.data.length ?? 0) > 1
                  ? "/my-projects"
                  : `project/${projects?.data?.[0]?.uuid}?tab=reporting-tasks`,
              children: t("View all reporting tasks")
            }
          : undefined
      }
    />
  );
};

export default ReportsCard;
