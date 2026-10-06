import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, ReactNode } from "react";

import { DisturbanceReportFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import {
  Extent0To20Icon,
  Extent21To40Icon,
  Extent41To60Icon,
  Extent61To80Icon,
  Extent81To100Icon,
  InfoIcon,
  IntensityHighIcon,
  IntensityLowIcon,
  IntensityMediumIcon
} from "@/redesignComponents/foundations/Icons";

const INTENSITY_ICON_MAP: Record<string, ReactNode> = {
  low: <IntensityLowIcon boxSize={8} color="error.900" />,
  medium: <IntensityMediumIcon boxSize={8} color="error.900" />,
  high: <IntensityHighIcon boxSize={8} color="error.900" />
};

const EXTENT_ICON_MAP: Record<string, ReactNode> = {
  "0-20": <Extent0To20Icon boxSize={8} color="error.900" />,
  "21-40": <Extent21To40Icon boxSize={8} color="error.900" />,
  "41-60": <Extent41To60Icon boxSize={8} color="error.900" />,
  "61-80": <Extent61To80Icon boxSize={8} color="error.900" />,
  "81-100": <Extent81To100Icon boxSize={8} color="error.900" />
};

const DisturbanceSeverity: FC<{ report: DisturbanceReportFullDto }> = ({ report }) => {
  const t = useT();
  const extent = report.entries?.find(entry => entry.name === "extent")?.value;

  return (
    <Box
      width="fit-content"
      height="auto"
      className="flex flex-col gap-5 pt-5 mobile:!w-full"
      css={{ "&": { alignItems: "self-end !important" } }}
    >
      <Flex className="items-start gap-5 mobile:w-full mobile:max-w-full mobile:overflow-x-auto">
        <Flex width="fit-content" flexDirection="column" alignItems="center" gap={2}>
          <Text color="primary.900" textStyle="300" textWrap="nowrap">
            {t("Intensity:")}{" "}
            <Tooltip content={t("The severity of the disturbance's impact on the affected area.")}>
              <InfoIcon className="h-3 w-3 text-theme-neutral-800" />
            </Tooltip>
          </Text>
          <Flex className="flex-col" alignItems="center" gap={1}>
            {report.intensity != null && INTENSITY_ICON_MAP[report.intensity.toLowerCase()]}
            <Text textStyle="400-bold" color="neutral.800" className="text-center leading-5">
              {report.intensity ?? t("N/A")}
            </Text>
          </Flex>
        </Flex>
        <Flex height="100%" width="fit-content" alignItems="center">
          <Box height="3.25rem" width="1px" backgroundColor="neutral.300" />
        </Flex>
        <Flex width="fit-content" flexDirection="column" alignItems="center" gap={2}>
          <Text color="primary.900" textStyle="300" textWrap="nowrap">
            {t("Extent:")}{" "}
            <Tooltip content={t("The percentage of the affected area impacted by the disturbance.")}>
              <InfoIcon className="h-3 w-3 text-theme-neutral-800" />
            </Tooltip>
          </Text>
          <Flex className="flex-col" alignItems="center" gap={1}>
            {extent != null && EXTENT_ICON_MAP[extent]}
            <Text textStyle="400-bold" color="neutral.800" className="text-center leading-5">
              {extent ?? t("N/A")}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default DisturbanceSeverity;
