import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

import Button from "../Button/Button";
import Text from "../Text/Text";

const ChecklistInformation = () => {
  return (
    <div className="text-white">
      <Text variant="text-14-bold">3 out 14</Text>
      <Text variant="text-14-light">Validation criteria are not met</Text>
      <Button variant="primary" className="mt-4">
        request support
      </Button>
      <div className="mt-3 grid gap-3">
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          GeoJSON Format
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          WGS84 Projection
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
          Earth Location
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
          Country
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          Reasonable Size Self-Intersecting Topology
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
          Overlapping Polygons
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          Spike
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          Polygon Integrity
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          GeoJSON Format
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.CHECK_PROGRESSBAR} className="h-4 w-4 text-green-400 lg:h-5 lg:w-5" />
          WGS84 Projection
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
          Earth Location
        </Text>
        <Text variant="text-14-light" className="flex items-center gap-2">
          <Icon name={IconNames.IC_ERROR} className="h-5 w-5 lg:h-6 lg:w-6" />
          Country
        </Text>
      </div>
    </div>
  );
};

export default ChecklistInformation;
