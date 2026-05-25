import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ValidationTag from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";
import ProgressBar from "@/redesignComponents/dataDisplay/Metrics/ProgressBar";
import {
  CheckApprovedIcon,
  ChevronDownIcon,
  InformationRequiredIcon,
  RejectedIcon
} from "@/redesignComponents/foundations/Icons";

import type { PolygonTableRow } from "../PolygonTableRow";

export interface ValidationSectionProps {
  polygons: PolygonTableRow[];
  color: string;
  onViewDetails?: (polygon: PolygonTableRow) => void;
}

const MockedPolygonValidationDetails = [
  {
    label: "No Overlapping Polygon",
    type: "error"
  },
  {
    label: "No Self-Intersection",
    type: "success"
  },
  {
    label: "Within Total Area Expected",
    details: [
      {
        label: "Site Goal",
        value: "A goal has not been specified."
      },
      {
        label: "Project Goal",
        value: "The sum of all project polygons 2669.92 ha is 177.99% of total hectares to be restored (1500.00 ha)"
      }
    ],
    type: "warning"
  },
  {
    label: "Inside Coordinate System",
    type: "error"
  },
  {
    label: "Within Country",
    type: "success"
  },
  {
    label: "No Spike",
    type: "error"
  },
  {
    label: "Polygon Type",
    type: "success"
  },
  {
    label: "Data Completed",
    type: "error"
  },
  {
    label: "Plant Start Date",
    type: "success"
  }
];

const ItemPolygon: FC<{ polygon: PolygonTableRow }> = ({ polygon }) => {
  const [isOpenViewDetails, setIsOpenViewDetails] = useState(false);
  const t = useT();
  return (
    <>
      <Flex justify="space-between" className="items-center gap-2">
        <Text textStyle="400" color="neutral.900" as="span">
          {polygon.polygonName}
        </Text>
        <Button
          variant={"borderless"}
          size="small"
          onClick={() => setIsOpenViewDetails(!isOpenViewDetails)}
          rightIcon={<ChevronDownIcon boxSize={2.5} className={isOpenViewDetails ? "rotate-180" : "rotate-0"} />}
        >
          {t("View Details")}
        </Button>
      </Flex>
      {isOpenViewDetails && (
        <Flex direction="column" ml={-6} gap={3} py={3} px={4} bg="neutral.200" mt={2.5} rounded={2.5}>
          <Box>
            <Text textStyle="300-bold" color="neutral.900" as="span">
              {t("4 out 10")}
            </Text>
            &nbsp;
            <Text textStyle="300" color="neutral.900" as="span">
              {t("Validation criteria are not met")}
            </Text>
          </Box>
          <List.Root gap="0" variant="plain" alignItems="baseline">
            {MockedPolygonValidationDetails.map(item => (
              <List.Item key={item.label}>
                <List.Indicator
                  asChild
                  color={item.type === "error" ? "error.500" : item.type === "success" ? "success.500" : "warning.500"}
                  boxSize={3}
                >
                  {item.type === "error" ? (
                    <RejectedIcon />
                  ) : item.type === "success" ? (
                    <CheckApprovedIcon />
                  ) : (
                    <InformationRequiredIcon />
                  )}
                </List.Indicator>
                <Box>
                  <Text textStyle="300" color="neutral.900">
                    {t(item.label)}
                  </Text>
                  {item.details != null && (
                    <Box mb={3}>
                      {item.details?.map(detail => (
                        <Text textStyle="200" color="neutral.800" key={detail.label}>
                          {t(detail.label)}: {t(detail.value)}
                        </Text>
                      ))}
                    </Box>
                  )}
                </Box>
              </List.Item>
            ))}
          </List.Root>
        </Flex>
      )}
    </>
  );
};

const ValidationSection: FC<ValidationSectionProps> = ({ polygons, color, onViewDetails }) => {
  const t = useT();

  if (polygons.length === 0) return null;

  return (
    <Flex direction="column" gap={3}>
      <Flex gap={3} alignItems="center">
        <ProgressBar height={8} progress={100} width="42.23%" color={color} />
        <Box>
          <Text textStyle="400-bold" color="primary.900" as="span">
            {polygons.length}
          </Text>
          &nbsp;
          <Text textStyle="400" color="neutral.700" as="span">
            {t("of")} {polygons.length}
          </Text>
        </Box>
        <ValidationTag status={polygons[0].validation} />
      </Flex>
      <Box>
        <Text textStyle="200-bold" color="neutral.700">
          {t("Polygon Analysed:")}
        </Text>
        <List.Root as="ul" pl={4} spaceY={1} ml={2} listStyleType="disc">
          {polygons.map(item => (
            <List.Item
              key={item.id}
              _marker={{
                color: "neutral.900"
              }}
            >
              <ItemPolygon polygon={item} />
            </List.Item>
          ))}
        </List.Root>
      </Box>
    </Flex>
  );
};

export default ValidationSection;
