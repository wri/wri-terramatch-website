import { useT } from "@transifex/react";
import Link from "next/link";
import { useMemo } from "react";

import { ActionDto } from "@/generated/v3/userService/userServiceSchemas";
import { getEntityCombinedStatus, getEntityDetailPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import { sortByDate } from "@/utils/sort";

import { IconNames } from "../../Icon/Icon";
import ActionTrackerCard, { getActionCardStatusMapper } from "../ActionTrackerCard";
import { ActionTrackerCardRowProps } from "../ActionTrackerCardRow";
import {
  type ReportActionTarget,
  filterDisplayableReportActions,
  getProjectName,
  getProjectUuid,
  getTaskUuid,
  groupSiteAndNurseryReportsByTask
} from "./ReportsCard.utils";

export type ReportsCardProps = {
  actions?: ActionDto[];
};

const ReportsCard = ({ actions }: ReportsCardProps) => {
  const t = useT();

  const { format } = useDate();

  const reportActions = useMemo(() => {
    if (!actions) return [];

    const displayableActions = filterDisplayableReportActions(actions);
    const projectReportActions = displayableActions.filter(a => a.targetableType === "projectReports");
    const siteAndNurseryByTask = groupSiteAndNurseryReportsByTask(displayableActions);

    type CardWithSort = { card: ActionTrackerCardRowProps; sortAt: string };

    const cardsWithSort: CardWithSort[] = [];

    projectReportActions.forEach(action => {
      const target = action.target as ReportActionTarget;
      const status = getEntityCombinedStatus(target);
      const projectUuid = getProjectUuid(target);
      const taskUuid = getTaskUuid(target);
      const dueText = target?.dueAt ? t("<strong>Due:</strong> {date}", { date: format(target.dueAt) }) : "";
      const ctaLink =
        status?.includes("due") && projectUuid && taskUuid
          ? `/project/${projectUuid}/reporting-task/${taskUuid}`
          : getEntityDetailPageLink("project-reports", target?.uuid ?? "");

      cardsWithSort.push({
        sortAt: target?.updatedAt ?? "",
        card: {
          ...getActionCardStatusMapper(t)[status ?? "started"],
          ctaLink,
          ctaText: t("View Report(s)"),
          title: getProjectName(target) ?? "",
          subtitle: `${action.text ?? ""}\n${dueText}`.trim(),
          updatedAt: t(`<strong>Last Updated</strong>: {date}`, {
            date: format(target?.updatedAt ?? "")
          })
        } as ActionTrackerCardRowProps
      });
    });

    siteAndNurseryByTask.forEach(({ siteReports, nurseryReports }, taskUuid) => {
      const hasProjectReportForTask = projectReportActions.some(a => {
        const tgt = a.target as ReportActionTarget;
        return getTaskUuid(tgt) === taskUuid;
      });
      if (hasProjectReportForTask) return;

      const allReports = [...siteReports, ...nurseryReports];
      const representative = allReports[0];
      if (!representative) return;

      const target = representative.target as ReportActionTarget;
      const projectUuid = getProjectUuid(target);
      if (!projectUuid) return;

      const statuses = allReports.map(r => getEntityCombinedStatus(r.target as ReportActionTarget));
      const status = statuses.some(
        s => s?.includes("needs-more-information") || s?.includes("requires-more-information")
      )
        ? "needs-more-information"
        : statuses.some(s => s?.includes("due"))
        ? "due"
        : "started";

      const maxUpdatedAt = allReports.reduce<string>((max, r) => {
        const u = (r.target as ReportActionTarget)?.updatedAt ?? "";
        return u > max ? u : max;
      }, "");
      const dueDates = allReports
        .map(r => (r.target as ReportActionTarget)?.dueAt)
        .filter((d): d is string => Boolean(d));
      const earliestDue =
        dueDates.length > 0 ? [...dueDates].sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0] : null;

      const dueText = earliestDue ? t("<strong>Due:</strong> {date}", { date: format(earliestDue) }) : "";
      const subtitle = t("Site and nursery reports available");
      const ctaLink = `/project/${projectUuid}/reporting-task/${taskUuid}`;

      cardsWithSort.push({
        sortAt: maxUpdatedAt,
        card: {
          ...getActionCardStatusMapper(t)[status],
          ctaLink,
          ctaText: t("View Report(s)"),
          title: getProjectName(target) ?? "",
          subtitle: `${subtitle}\n${dueText}`.trim(),
          updatedAt: t(`<strong>Last Updated</strong>: {date}`, {
            date: format(maxUpdatedAt)
          })
        } as ActionTrackerCardRowProps
      });
    });

    return sortByDate([...cardsWithSort], "sortAt")
      .map(({ card }) => card)
      .slice(0, 5);
  }, [actions, format, t]);

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
