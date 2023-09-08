import { Else, If, Then, When } from "react-if";

import Text from "@/components/elements/Text/Text";

import Icon, { IconNames } from "../Icon/Icon";
import List from "../List/List";
import ActionTrackerCardEmptyState, { ActionTrackerCardEmptyStateProps } from "./ActionTrackerCardEmptyState";
import ActionTrackerCardRow, { ActionTrackerCardRowProps } from "./ActionTrackerCardRow";

export type ActionTrackerCardProps = {
  title: string;
  subtitle?: string;
  icon: IconNames;
  emptyState: ActionTrackerCardEmptyStateProps;
  data: ActionTrackerCardRowProps[];
};

const ActionTrackerCard = (props: ActionTrackerCardProps) => {
  return (
    <div className="flex h-[520px] flex-col items-center rounded-xl border border-neutral border-opacity-30 bg-white px-4 py-6">
      <Icon name={props.icon} className="mb-3 fill-success" width={36} height={36} />
      <Text variant="text-heading-500" className="mb-2">
        {props.title}
      </Text>
      <When condition={!!props.subtitle}>
        <Text variant="text-body-500">{props.subtitle}</Text>
      </When>
      <If condition={!!props.data?.length}>
        <Then>
          <List
            className="scroll-indicator-hide mt-4 flex h-full w-full flex-1 flex-col gap-3 overflow-y-auto rounded-lg border border-neutral border-opacity-30 p-4"
            items={props.data}
            render={row => <ActionTrackerCardRow {...row} />}
          />
        </Then>
        <Else>
          <ActionTrackerCardEmptyState {...props.emptyState} className="mt-4" />
        </Else>
      </If>
    </div>
  );
};

export default ActionTrackerCard;
