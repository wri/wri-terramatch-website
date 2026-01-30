import { useT } from "@transifex/react";
import Link from "next/link";
import { useMemo } from "react";

import { usePutV2MyActionsUUIDComplete } from "@/generated/apiComponents";
import { ActionDto } from "@/generated/v3/userService/userServiceSchemas";
import { getEntityCombinedStatus, getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import ApiSlice from "@/store/apiSlice";
import { sortByDate } from "@/utils/sort";

import { IconNames } from "../../Icon/Icon";
import ActionTrackerCard, { getActionCardStatusMapper } from "../ActionTrackerCard";
import { ActionTrackerCardRowProps } from "../ActionTrackerCardRow";

export type ReportsCardProps = {
  actions?: ActionDto[];
};

const ReportsCard = ({ actions }: ReportsCardProps) => {
  const t = useT();

  const { mutate: clearAction } = usePutV2MyActionsUUIDComplete();
  const { format } = useDate();

  const reportActions = useMemo(() => {
    if (!actions) return [];
    return sortByDate(actions, "target.updatedAt")
      .filter(action => action.target != null)
      .slice(0, 5)
      .map(action => {
        const target = action.target as any;
        const project = target?.project ?? target;
        const type = action.targetableType;
        const status = getEntityCombinedStatus(target);

        let dueText = t("<strong>Due:</strong> {date}", { date: format(target?.dueAt) });
        let subtitle;
        let ctaText;
        let ctaLink;

        switch (type) {
          case "projectReports": {
            ctaText = t("View Project Report");
            subtitle = action.text;

            if (status?.includes("due")) {
              ctaLink = `/project/${target?.project?.uuid ?? target?.projectUuid}/reporting-task/${
                target?.task?.uuid ?? target?.taskUuid
              }`;
            } else ctaLink = getEntityDetailPageLink("project-reports", target?.uuid);
            break;
          }
          case "nurseryReports": {
            ctaText = t("View Nursery Report");
            subtitle = t("<strong>Nursery:</strong> {name}", { name: target?.name });

            if (status?.includes("due")) {
              ctaLink = `/project/${target?.project?.uuid ?? target?.projectUuid}/reporting-task/${
                target?.task?.uuid ?? target?.taskUuid
              }`;
            } else ctaLink = `reports/nursery-report/${target?.uuid}`;
            break;
          }
          case "siteReports": {
            ctaText = t("View Site Report");
            subtitle = t("<strong>Site:</strong> {name}", { name: target?.name });

            if (status?.includes("due")) {
              ctaLink = `/project/${
                target?.project?.uuid ?? target?.projectUuid ?? target?.site?.project?.uuid
              }/reporting-task/${target?.task?.uuid ?? target?.taskUuid}`;
            } else ctaLink = `reports/site-report/${target?.uuid}`;
            break;
          }
        }

        return {
          ...getActionCardStatusMapper(t)[status!],
          ctaLink,
          ctaText,
          title: project?.name,
          subtitle: `${subtitle != null ? `${subtitle}\n` : ""}${target?.dueAt != null ? dueText : ""}`,
          updatedAt: t(`<strong>Last Updated</strong>: {date}`, {
            date: format(target.updatedAt)
          }),
          onClick: () => {
            action.uuid && clearAction({ pathParams: { uuid: action.uuid } });
            ApiSlice.pruneCache("actions", [action.uuid]);
          }
        } as ActionTrackerCardRowProps;
      });
  }, [actions, format, clearAction, t]);

  return (
    <ActionTrackerCard
      data={reportActions}
      title={t("Reports")}
      subtitle={reportActions.length && t("You have {n} report(s) to complete", { n: reportActions.length })}
      icon={IconNames.ARROW_SPIN_CIRCLE}
      limit={5}
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
    />
  );
};

export default ReportsCard;
