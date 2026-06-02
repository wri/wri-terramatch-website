import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo, useState } from "react";

import type { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { parseV3ValidationData } from "@/helpers/polygonValidation";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ValidationTag from "@/redesignComponents/actions/Tags/ValidationTag/ValidationTag";
import ProgressBar from "@/redesignComponents/dataDisplay/Metrics/ProgressBar";
import { ChevronDownIcon, ChevronRightIcon } from "@/redesignComponents/foundations/Icons";

import type { PolygonTableRow } from "../PolygonTableRow";
import ValidationDetail from "../ValidationDetail";

export interface ValidationSectionProps {
  polygons: PolygonTableRow[];
  color: string;
  polygonValidations: Map<string, ValidationDto>;
  onViewDetails?: (polygon: PolygonTableRow) => void;
}

const ItemPolygon: FC<{
  polygon: PolygonTableRow;
  validation: ValidationDto | undefined;
  onViewDetails?: (polygon: PolygonTableRow) => void;
}> = ({ polygon, validation, onViewDetails }) => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useT();

  const items = useMemo(() => (validation == null ? [] : parseV3ValidationData(validation)), [validation]);
  const totalItems = items.length;
  const failedCount = items.filter(i => !i.status).length;
  const hasDetails = totalItems > 0;

  return (
    <>
      <Flex justify="space-between" className="items-center gap-2">
        <Flex align="center" gap={2} className="min-w-0">
          <Box as="span" boxSize="6px" rounded="full" bg="neutral.900" flexShrink={0} aria-hidden="true" />
          <Text textStyle="400" color="neutral.900" as="span" className="truncate">
            {polygon.polygonName}
          </Text>
        </Flex>
        <Button
          variant={"borderless"}
          size="small"
          disabled={!hasDetails}
          onClick={() => setIsOpen(!isOpen)}
          rightIcon={<ChevronDownIcon boxSize={2.5} className={isOpen ? "rotate-180" : "rotate-0"} />}
        >
          {t("View Details")}
        </Button>
      </Flex>
      {isOpen && hasDetails && (
        <Flex direction="column" ml={-4} gap={3} py={3} px={4} bg="neutral.200" mt={2.5} rounded={2.5}>
          <ValidationDetail failedCount={failedCount} totalItems={totalItems} items={items} />
          <Box className="w-fit">
            <Button
              variant="secondary"
              rightIcon={<ChevronRightIcon />}
              size="small"
              onClick={() => onViewDetails?.(polygon)}
              className="w-fit"
            >
              {t("View Polygon")}
            </Button>
          </Box>
        </Flex>
      )}
    </>
  );
};

const ValidationSection: FC<ValidationSectionProps> = ({ polygons, color, polygonValidations, onViewDetails }) => {
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
        <Text textStyle="200-bold" color="neutral.700" mb={2.5}>
          {t("Polygon Analysed:")}
        </Text>
        <List.Root as="ul" pl={2} spaceY={1} ml={2} listStyleType="none">
          {polygons.map(item => (
            <List.Item key={item.id}>
              <ItemPolygon polygon={item} validation={polygonValidations.get(item.id)} onViewDetails={onViewDetails} />
            </List.Item>
          ))}
        </List.Root>
      </Box>
    </Flex>
  );
};

export default ValidationSection;
