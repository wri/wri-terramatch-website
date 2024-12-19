import React from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Dropdown from "../Inputs/Dropdown/Dropdown";
import Text from "../Text/Text";

const TooltipMapMonitoringGridData = [
  {
    title: "Tree Planting",
    data: [
      {
        date: "24 Aug 2023",
        area: "234 ha"
      },
      {
        date: "16 Sept 2024",
        area: "784 ha"
      },
      {
        date: "8 Jan 2025",
        area: "352 ha"
      }
    ]
  },
  {
    title: "Asst. Nat. Regeneration",
    data: [
      {
        date: "24 Aug 2023",
        area: "234 ha"
      },
      {
        date: "16 Sept 2024",
        area: "784 ha"
      },
      {
        date: "8 Jan 2025",
        area: "352 ha"
      }
    ]
  },
  {
    title: "Forest Management",
    data: [
      {
        date: "24 Aug 2023",
        area: "234 ha"
      },
      {
        date: "16 Sept 2024",
        area: "784 ha"
      },
      {
        date: "8 Jan 2025",
        area: "352 ha"
      }
    ]
  }
];

const TooltipMapMonitoringDropdownData = [
  { title: "Tree Planting", value: "1" },
  { title: "Asst. Nat. Regeneration", value: "2" },
  { title: "Forest Management", value: "3" }
];

const TooltipMapMonitoring = () => {
  return (
    <div className="flex max-h-[350px] min-w-[225px] flex-col gap-3 rounded-lg bg-white py-3">
      <div className="flex justify-between px-3">
        <div className="flex flex-col">
          <Text variant={"text-14-bold"} className="text-darkCustom">
            Elom
          </Text>
          <Text variant={"text-12-light"} className="text-darkCustom">
            Nthangu Forest Est. 2023
          </Text>
        </div>
        <button className="h-6 w-6 rounded bg-grey-200 p-1.5 hover:bg-grey-800">
          <Icon name={IconNames.CLEAR} className="h-full w-full text-darkCustom-100" />
        </button>
      </div>
      <div className="flex items-center justify-between px-3">
        <Text variant={"text-12-light"} className="text-darkCustom">
          24 Aug 2023
        </Text>
        <Text variant={"text-12-semibold"} className="text-darkCustom">
          5, 253ha
        </Text>
      </div>
      <hr className="mx-3 border-neutral-450" />
      <Dropdown
        options={TooltipMapMonitoringDropdownData}
        onChange={() => {}}
        containerClassName="px-3"
        inputVariant="text-12-light"
        optionVariant="text-12-light"
        className="h-8"
      />
      <div className="flex min-h-0 w-full pl-3 pr-1.5">
        <div className="flex min-h-0 w-full flex-col gap-3 overflow-auto pr-1.5">
          {TooltipMapMonitoringGridData.map((item, index) => (
            <div key={index} className="grid grid-cols-[auto_auto] gap-1">
              <Text className="col-span-2" variant={"text-12"}>
                {item.title}
              </Text>
              {item.data.map((data, index) => (
                <React.Fragment key={index}>
                  <Text variant={"text-12-light"} className="text-darkCustom">
                    {data.date}
                  </Text>
                  <Text variant={"text-12-semibold"} className="text-end text-darkCustom">
                    {data.area}
                  </Text>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TooltipMapMonitoring;
