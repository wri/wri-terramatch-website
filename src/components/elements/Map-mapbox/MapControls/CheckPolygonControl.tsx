import classNames from "classnames";
import { useState } from "react";

import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

const CheckPolygonControl = () => {
  const [openCollapse, setOpenCollapse] = useState(false);
  const polygonCheckData = [
    {
      id: "1",
      status: true,
      label: "Polygon 1213023412"
    },
    {
      id: "2",
      status: true,
      label: "Polygon 1234825234"
    },
    {
      id: "3",
      status: false,
      label: "Polygon 2321340880"
    },
    {
      id: "4",
      status: false,
      label: "Polygon 1234825235"
    },
    {
      id: "5",
      status: true,
      label: "Polygon 2321340881"
    },
    {
      id: "6",
      status: true,
      label: "Polygon 2321340882"
    },
    {
      id: "7",
      status: false,
      label: "Polygon 2321340883"
    },
    {
      id: "8",
      status: false,
      label: "Polygon 2321340884"
    }
  ];
  return (
    <div className="grid gap-2">
      <div className=" rounded-lg bg-[#ffffff26] p-3 text-center text-white backdrop-blur-md">
        <Text variant="text-10-light">Your polygons have been updated</Text>
        <Button
          variant="text"
          className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-tertiary-600 bg-tertiary-600 p-2 hover:border-white"
        >
          Check Polygons
        </Button>
      </div>
      <div className="relative flex w-[231px] flex-col gap-2 rounded-xl p-3">
        <div className="absolute top-0 left-0 -z-10 h-full w-full rounded-xl bg-[#FFFFFF33] backdrop-blur-md" />
        <button
          onClick={() => {
            setOpenCollapse(!openCollapse);
          }}
          className="flex items-center justify-between"
        >
          <Text variant="text-10-bold" className="text-white">
            Polygon Checks
          </Text>
          <Icon
            name={IconNames.CHEVRON_DOWN}
            className={classNames(
              "h-4 w-4 text-white duration-300",
              openCollapse ? "rotate-180 transform" : "rotate-0 transform"
            )}
          />
        </button>
        {openCollapse &&
          polygonCheckData.map(polygon => (
            <div key={polygon.id} className="flex items-center gap-2">
              <Icon
                name={polygon.status ? IconNames.ROUND_GREEN_TICK : IconNames.ROUND_RED_CROSS}
                className="h-4 w-4"
              />
              <Text variant="text-10-light" className="text-white">
                {polygon.label}
              </Text>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CheckPolygonControl;
