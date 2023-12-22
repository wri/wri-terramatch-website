import { useT } from "@transifex/react";
import { useMemo } from "react";
import { Else, If, Then, When } from "react-if";

import Button, { IButtonProps } from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import List from "../List/List";
import { SubmissionStatusMapping } from "../Tables/ReportingTasksTable";
import ActionTrackerCardEmptyState, { ActionTrackerCardEmptyStateProps } from "./ActionTrackerCardEmptyState";
import ActionTrackerCardRow, { ActionTrackerCardRowProps } from "./ActionTrackerCardRow";

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
  awaiting: {
    statusText: t("Awaiting Review"),
    status: "awaiting"
  },
  pending: {
    statusText: t("Pending"),
    status: "awaiting"
  },
  "needs-more-information": {
    statusText: t("More info requested"),
    status: "warning"
  },
  "nothing-to-report": {
    status: "warning",
    statusText: t("Nothing Reported")
  },
  ...SubmissionStatusMapping(t)
});

export type ActionTrackerCardProps = {
  title: string;
  subtitle?: string;
  icon: IconNames;
  emptyState: ActionTrackerCardEmptyStateProps;
  cta?: IButtonProps;
  data: ActionTrackerCardRowProps[];
  limit?: number;
};

const ActionTrackerCard = (props: ActionTrackerCardProps) => {
  const items = useMemo(() => {
    if (!props.data || props.data.length === 0) {
      return [];
    }

    if (props.limit) {
      return [...props.data].splice(0, props.limit);
    }

    return props.data;
  }, [props.data, props.limit]);

  return (
    <div className="flex h-full max-h-[567px] min-h-[492px] flex-col items-center rounded-xl border border-neutral border-opacity-30 bg-white px-4 py-6">
      <Icon name={props.icon} className="mb-3 min-h-[50px] fill-success" width={50} height={50} />
      <Text variant="text-heading-500" className="mb-2">
        {props.title}
      </Text>
      <When condition={!!props.subtitle}>
        <Text variant="text-body-500">{props.subtitle}</Text>
      </When>
      <If condition={!!items.length}>
        <Then>
          <List
            className="scroll-indicator-hide mt-4 flex h-full w-full flex-1 flex-col gap-3 overflow-y-auto rounded-lg border border-neutral border-opacity-30 p-4"
            items={items}
            render={row => <ActionTrackerCardRow {...row} />}
          />
          <When condition={!!props.cta}>
            <Button {...props.cta} className="mt-4" />
          </When>
        </Then>
        <Else>
          <ActionTrackerCardEmptyState {...props.emptyState} className="mt-4" />
        </Else>
      </If>
    </div>
  );
};

export default ActionTrackerCard;
