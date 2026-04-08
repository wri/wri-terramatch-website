import { useT } from "@transifex/react";
import Link from "next/link";
import { useMemo } from "react";

import { ActionDto } from "@/generated/v3/userService/userServiceSchemas";
import { getEntityCombinedStatus, getEntityDetailPageLink, getEntityEditPageLink } from "@/helpers/entity";
import { useDate } from "@/hooks/useDate";
import { sortByDate } from "@/utils/sort";

import { IconNames } from "../../Icon/Icon";
import ActionTrackerCard, { getActionCardStatusMapper } from "../ActionTrackerCard";
import { ActionTrackerCardRowProps } from "../ActionTrackerCardRow";

export type ProjectsCardProps = {
  actions?: ActionDto[];
};

const ProjectsCard = ({ actions }: ProjectsCardProps) => {
  const t = useT();
  const { format } = useDate();

  const projectActions = useMemo(() => {
    if (!actions) return [];
    return sortByDate(actions, "target.updatedAt")
      .filter(action => action.target != null)
      .slice(0, 5)
      .map(action => {
        const target = action.target as any;
        const project = target?.project ?? target;
        const type = action.targetableType;
        const status = getEntityCombinedStatus(target);

        let subtitle = "";
        let ctaText = t("View Project Details");
        let ctaLink = getEntityDetailPageLink("projects", project?.uuid);

        switch (type) {
          case "nurseries": {
            ctaText = t("View Nursery Details");
            subtitle = t("<strong>Nursery:</strong> {name}", { name: target?.name });
            ctaLink = getEntityDetailPageLink("nurseries", target?.uuid);
            break;
          }
          case "sites": {
            ctaText = t("View Site Details");
            subtitle = t("<strong>Site:</strong> {name}", { name: target?.name });
            ctaLink = getEntityDetailPageLink("sites", target?.uuid);

            break;
          }
        }

        switch (status) {
          case "started": {
            ctaText = t("Continue Project");
            subtitle = "";
            ctaLink = `/entity/projects/edit/${project?.uuid}`;
            break;
          }
          case "awaiting-approval": {
            ctaText = t("View Project");
            subtitle = "";
            ctaLink = getEntityDetailPageLink("projects", project?.uuid);
            break;
          }
          case "needs-more-information": {
            ctaText = t("View Project");
            subtitle = "";
            ctaLink = getEntityEditPageLink("projects", project?.uuid);
            break;
          }
        }

        return {
          ...getActionCardStatusMapper(t)[status!],
          ctaLink,
          ctaText,
          title: project?.name,
          subtitle,
          updatedAt: t(`<strong>Last Updated</strong>: {date}`, {
            date: format(target.updatedAt)
          })
        } as ActionTrackerCardRowProps;
      });
  }, [format, actions, t]);

  return (
    <ActionTrackerCard
      data={projectActions}
      title={t("Projects")}
      subtitle={projectActions.length && t("You have {n} outstanding task(s)", { n: projectActions.length })}
      icon={IconNames.LAPTOP_CIRCLE}
      limit={5}
      emptyState={{
        title: t("Track your project updates"),
        subtitle: t("You will find the updates to your projects here. To view your projects, click the button below."),
        buttonProps: {
          as: Link,
          href: "/my-projects",
          children: t("View my projects")
        }
      }}
      cta={{ as: Link, href: "/my-projects", children: t("View all projects") }}
    />
  );
};

export default ProjectsCard;
