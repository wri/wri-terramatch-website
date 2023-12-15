import { useT } from "@transifex/react";
import Link from "next/link";
import { useMemo } from "react";

import { GetV2MyActionsResponse, usePutV2MyActionsUUIDComplete } from "@/generated/apiComponents";
import { getEntityCombinedStatus, getEntityDetailPageLink } from "@/helpers/entity";
import { sortByDate } from "@/utils/sort";

import { IconNames } from "../../Icon/Icon";
import ActionTrackerCard, { getActionCardStatusMapper } from "../ActionTrackerCard";
import { ActionTrackerCardRowProps } from "../ActionTrackerCardRow";

export type ProjectsCardProps = {
  actions?: GetV2MyActionsResponse["data"];
};

const ProjectsCard = ({ actions }: ProjectsCardProps) => {
  const t = useT();

  const { mutate } = usePutV2MyActionsUUIDComplete();

  const projectActions = useMemo(() => {
    if (!actions) return [];

    return sortByDate(actions, "updated_at")
      .filter(action => !!action.target)
      .map(action => {
        const target = action.target;
        // Project is either the target itself or, if it has a project object, it is that.
        const project = action.target?.project ?? action.target;
        const type = action.targetable_type;
        const status = getEntityCombinedStatus(target);
        // When true, the action is cleared on the client side when the user clicks it, otherwise this is handled BED side.
        let canClearActionClientSide = status === "approved" || status === "rejected";

        let subtitle = "";
        let ctaText = t("View Project Details");
        let ctaLink = getEntityDetailPageLink("projects", project?.uuid);

        switch (type) {
          case "Nursery": {
            ctaText = t("View Nursery Details");
            subtitle = t("<strong>Nursery:</strong> {name}", { name: target?.name });
            ctaLink = getEntityDetailPageLink("nurseries", target?.uuid);
            break;
          }
          case "Site": {
            ctaText = t("View Site Details");
            subtitle = t("<strong>Site:</strong> {name}", { name: target?.name });
            ctaLink = getEntityDetailPageLink("sites", target?.uuid);

            break;
          }
        }

        return {
          ...getActionCardStatusMapper(t)[status!],
          ctaLink,
          ctaText,
          title: project?.name,
          subtitle,
          onClick: () => {
            canClearActionClientSide && action.uuid && mutate({ pathParams: { uuid: action.uuid } });
          }
        } as ActionTrackerCardRowProps;
      });
  }, [actions, mutate, t]);

  return (
    <ActionTrackerCard
      data={projectActions}
      title={t("Projects")}
      subtitle={projectActions.length && t("You have {n} updates", { n: projectActions.length })}
      icon={IconNames.LAPTOP_CIRCLE}
      limit={10}
      emptyState={{
        title: t("Track your project updates"),
        subtitle: t("You will find the updates to your projects here. To view your projects, click the button below."),
        buttonProps: {
          as: Link,
          href: "/my-projects",
          children: t("View my projects")
        }
      }}
      cta={
        projectActions.length > 10 ? { as: Link, href: "/my-projects", children: t("View all projects") } : undefined
      }
    />
  );
};

export default ProjectsCard;
