import classNames from "classnames";

import Text from "@/components/elements/Text/Text";

import { DashboardTableDataProps } from "../dashboard/index.page";

const GraphicIconDashoard = ({ data }: { data: DashboardTableDataProps[] }) => {
  const colorIconLabel = (label: string) => {
    switch (label) {
      case "Agroforest":
        return { color: "bg-tertiary-800", icon: "IC_AGROFOREST" };

      case "Natural Forest":
        return { color: "bg-green-60", icon: "IC_NATURAL_FOREST" };

      case "Mangrove":
        return { color: "bg-green-300", icon: "IC_MANGROVE" };

      case "Woodlot / Plantation":
        return { color: "bg-yellow-600", icon: "IC_WOODLOT" };

      case "Open Natural Ecosystem":
        return { color: "bg-red-1000", icon: "IC_OPEN_NATURAL_ECOSYSTEM" };

      case "Riparian Area / Wetland":
        return { color: "bg-green-350", icon: "IC_RIPARIAN_AREA" };

      case "Urban Forest":
        return { color: "bg-blueCustom", icon: "IC_URBAN_FOREST" };

      case "Silvopasture":
        return { color: "bg-red-900", icon: "IC_SILVOPASTURE" };
      case "Peatland":
        return { color: "bg-purpleCustom-500", icon: "IC_PEATLAND" };
      default:
        return { color: "bg-tertiary-800", icon: "IC_AGROFOREST" };
    }
  };

  return (
    <div className="grid w-full gap-4">
      <div className="relative flex h-9 w-full rounded bg-blueCustom-30 first:rounded-l first-of-type:rounded-l lg:h-10 ">
        {data.map((item, index) => {
          return (
            <div
              className={classNames(
                "relative h-9 w-0 lg:h-10",
                colorIconLabel(item.label).color,
                index === 0 && "rounded-l",
                index === data.length - 1 && "rounded-r"
              )}
              style={{ width: `${item.value}%` }}
              key={index}
            />
          );
        })}
      </div>
      <div className="w-full">
        {data.map((item, index) => {
          console.log(item);
          return (
            <div key={index} className={`${index + 1 !== data.length && "border-b"} w-full border-grey-350 py-2`}>
              <div className="flex w-full justify-between">
                <div>
                  <Text variant="text-14-light" className=" text-darkCustom">
                    {item.label}
                  </Text>
                </div>
                <Text variant="text-14" className=" text-darkCustom">
                  {item.valueText}
                </Text>
              </div>
              <div className="relative h-4 rounded bg-blueCustom-30 lg:h-5">
                <div
                  className={classNames("relative h-4 w-0 rounded lg:h-5", colorIconLabel(item.label).color)}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GraphicIconDashoard;
