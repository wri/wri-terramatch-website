import React, { FC } from "react";
import { TabbedShowLayout, TabProps } from "react-admin";

import Accordion from "@/components/elements/Accordion/Accordion";
import Text from "@/components/elements/Text/Text";
import Toggle from "@/components/elements/Toggle/Toggle";
import { VARIANT_TOGGLE_SECONDARY } from "@/components/elements/Toggle/ToggleVariants";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { EntityName } from "@/types/common";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity?: EntityName;
}

const HistoryTab: FC<IProps> = ({ label, entity, ...rest }) => {
  return (
    <TabbedShowLayout.Tab label={label ?? "History"} {...rest}>
      <div className="flex flex-col gap-4">
        <div>Table</div>
        <Accordion
          title="Financial Documents per Year"
          variant="drawer"
          className="rounded-lg bg-white px-6 py-4 shadow-all"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Text variant="text-14-bold" className="text-blueCustom-900">
                2020
              </Text>
              <button className="flex items-center gap-2 rounded p-4 shadow-monitored">
                <Icon name={IconNames.FILE} className="h-6 w-6 text-blueCustom-900" />
                <Text variant="text-14-bold" className="w-full truncate text-left text-blueCustom-900">
                  GFW Pro High Level Arch Diagram Feb 2023
                </Text>
                <Icon name={IconNames.DOWNLOAD} className="h-6 w-6 text-blueCustom-900 opacity-60" />
              </button>
              <button className="flex items-center gap-2 rounded p-4 shadow-monitored">
                <Icon name={IconNames.FILE} className="h-6 w-6 text-blueCustom-900" />
                <Text variant="text-14-bold" className="w-full truncate text-left text-blueCustom-900">
                  TERRAFUND Reference Letter New
                </Text>
                <Icon name={IconNames.DOWNLOAD} className="h-6 w-6 text-blueCustom-900 opacity-60" />
              </button>
            </div>
            <div className="flex flex-col gap-1">
              <Text variant="text-14-bold" className="text-blueCustom-900">
                2022
              </Text>
              <Text variant="text-16-light" className="text-blueCustom-900">
                None
              </Text>
            </div>
          </div>
        </Accordion>
        <Accordion
          title="Descriptions of Financials per Year"
          variant="drawer"
          className="rounded-lg bg-white px-6 py-4 shadow-all"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <Text variant="text-16-bold" className="text-blueCustom-900">
                2020
              </Text>
              <Text variant="text-16-light" className="w-full truncate text-left text-blueCustom-900">
                The organization faced significant revenue decline of 15% due to pandemic-related disruptions
                <br />
                while maintaining stable operating margins through aggressive cost-cutting measures.
              </Text>
            </div>
          </div>
        </Accordion>
        <Accordion
          title="Major Funding Sources by Year"
          variant="drawer"
          className="rounded-lg bg-white px-6 py-4 shadow-all"
        >
          <div className="flex flex-col gap-4">
            <Toggle
              variant={VARIANT_TOGGLE_SECONDARY}
              items={[
                { key: "2020", render: 2020 },
                { key: "2021", render: 2021 },
                { key: "2022", render: 2022 },
                { key: "2023", render: 2023 },
                { key: "2024", render: 2024 }
              ]}
            />
            <div>Table</div>
          </div>
        </Accordion>
      </div>
    </TabbedShowLayout.Tab>
  );
};

export default HistoryTab;
