import React from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Text from "../Text/Text";
export interface TooltipMapProps {
  setTooltipOpen: () => void;
  setEditPolygon: () => void;
  polygon: any;
  popup?: any;
  formattedPlantStartDate: any;
}
const topBorderColorPopup: any = {
  submitted: "border-t-primary",
  approved: "border-t-[#72D961]",
  "needs-more-information": "border-t-[#FF8938]"
};

const TooltipMap = (props: TooltipMapProps) => {
  const { setTooltipOpen, setEditPolygon, polygon, formattedPlantStartDate } = props;
  return (
    <div
      className={`absolute z-20 w-[295px] rounded border-t-[5px] ${
        topBorderColorPopup[polygon?.status]
      } bg-white px-3 pb-3 pt-[7px]`}
      style={{
        bottom: "0",
        transform: "translate(-50%, 0px)"
      }}
    >
      <button onClick={setTooltipOpen} className="absolute right-2 top-2 ml-2 rounded p-1 hover:bg-grey-800">
        <Icon name={IconNames.CLEAR} className="h-3 w-3 text-darkCustom-100" />
      </button>

      <div className="text-10 flex items-center justify-center gap-1">
        <Text variant="text-10" className="mb-1 uppercase leading-[normal]">
          {polygon?.site_name} SITE
        </Text>
      </div>
      <Text variant="text-10-bold" className="text-center leading-[normal] text-black">
        {polygon?.poly_name ? polygon?.poly_name : "Unnamed Polygon"}
      </Text>
      <hr className="my-2 border border-grey-750" />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Text variant="text-10-light" className="mb-[2px] leading-[normal]">
            Restoration Practice
          </Text>
          <Text variant="text-10-bold" className="leading-[normal] text-black ">
            {polygon?.practice ? polygon?.practice : "Unknown"}
          </Text>
        </div>
        <div>
          <Text variant="text-10-light" className="mb-[2px] leading-[normal]">
            Target Land Use System
          </Text>
          <Text variant="text-10-bold" className="leading-[normal] text-black ">
            {polygon?.target_sys ? polygon?.target_sys : "Unknown"}
          </Text>
        </div>
        <div>
          <Text variant="text-10-light" className="mb-[2px] leading-[normal]">
            Tree Distribution
          </Text>
          <Text variant="text-10-bold" className="leading-[normal] text-black">
            {polygon?.distr ? polygon?.distr : "Unknown"}
          </Text>
        </div>
        <div>
          <Text variant="text-10-light" className="mb-[2px] leading-[normal]">
            Planting Start Date
          </Text>
          <Text variant="text-10-bold" className="leading-[normal] text-black ">
            {formattedPlantStartDate}
          </Text>
        </div>
      </div>

      <hr className="my-2 border border-grey-750" />
      <div className="flex w-full items-center justify-center">
        <button className="flex items-center justify-center gap-1" onClick={setEditPolygon}>
          <Icon name={IconNames.CLICK} className="h-4 w-4" />
          <Text variant="text-10-light" className="italic text-black">
            click to see polygon details
          </Text>
        </button>
      </div>
    </div>
  );
};

export default TooltipMap;
