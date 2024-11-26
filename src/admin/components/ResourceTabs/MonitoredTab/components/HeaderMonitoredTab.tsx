import classNames from "classnames";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

const HeaderMonitoredTab = () => {
  const dataPolygonOverview = [
    {
      status: "Draft",
      count: 12.5,
      color: "bg-grey-200"
    },
    {
      status: "Submitted",
      count: 42.5
    },
    {
      status: "Needs Info",
      count: 22.5
    },
    {
      status: "Approved",
      count: 22.5
    }
  ];

  const colorBg: { [key: string]: string } = {
    Draft: "bg-neutral-500 hover:shadow-[#E3E3E3]",
    Submitted: "bg-primary hover:shadow-[#2398D833]",
    "Needs Info": "bg-tertiary-600 hover:shadow-[#ffe7d7]",
    Approved: "bg-success-600 hover:shadow-[#d4f3eb]"
  };

  return (
    <div className="flex w-full items-center justify-between rounded-xl px-6 py-3 shadow-monitored">
      <div className="flex items-baseline gap-9">
        <div className="w-[35vw]">
          <div className="flex items-center justify-between">
            <Text variant="text-14-semibold">Polygon Overview</Text>
            <div>
              <Text as="span" variant="text-12" className="text-darkCustom-300">
                Analyzed:
              </Text>{" "}
              <Text as="span" variant="text-12-bold" className="text-darkCustom-300">
                Baseline
              </Text>
            </div>
          </div>
          <div className="flex w-[35vw] gap-1 pt-2 lg:gap-[6px]">
            {dataPolygonOverview.map((item, index) => (
              <div key={index} style={{ width: `${item.count}%` }}>
                <div
                  className={classNames(
                    "h-[6px] w-full cursor-pointer rounded-sm hover:shadow-item-monitored lg:h-[8px] wide:h-[10px]",
                    colorBg[item.status]
                  )}
                />
                <Text variant="text-12" className="pt-1 text-darkCustom-300">
                  {item.status}
                </Text>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <Text variant="text-12" className=" text-darkCustom">
              No. of Polygons
            </Text>
            <Text variant="text-12-bold" className="text-darkCusto pt-1">
              45
            </Text>
          </div>
          <div>
            <Text variant="text-12" className=" text-darkCustom">
              No. of Sites
            </Text>
            <Text variant="text-12-bold" className="pt-1 text-darkCustom">
              12
            </Text>
          </div>
        </div>
      </div>
      <div className="flex gap-4">
        <button className="h-full text-darkCustom hover:text-primary">
          <Icon name={IconNames.IC_NOTIFICATION} className="h-full " />
        </button>
        <Button variant="primary" className="!rounded-lg">
          Update analysis
        </Button>
      </div>
    </div>
  );
};

export default HeaderMonitoredTab;
