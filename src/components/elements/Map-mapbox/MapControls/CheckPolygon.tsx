import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

const CheckPolygon = () => {
  const polygonCheckData = [
    {
      id: "1",
      status: true,
      label: "GeoJSON Format"
    },
    {
      id: "2",
      status: true,
      label: "WGS84 Projection"
    },
    {
      id: "3",
      status: false,
      label: "Earth Location"
    },
    {
      id: "4",
      status: false,
      label: "Country"
    },
    {
      id: "5",
      status: true,
      label: "Reasonable Size Self-Intersecting Topology"
    },
    {
      id: "6",
      status: false,
      label: "Overlapping Polygons"
    },
    {
      id: "7",
      status: true,
      label: "Spike"
    },
    {
      id: "8",
      status: true,
      label: "Polygon Integrity"
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
        <Text variant="text-10-bold" className="text-white">
          Polygon Checks
        </Text>
        {polygonCheckData.map(polygon => (
          <div key={polygon.id} className="flex items-center gap-2">
            <Icon name={polygon.status ? IconNames.ROUND_GREEN_TICK : IconNames.ROUND_RED_CROSS} className="h-4 w-4" />
            <Text variant="text-10-light" className="text-white">
              {polygon.label}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckPolygon;
