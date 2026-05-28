import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useMemo, useState } from "react";

import type { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import { parseV3ValidationData } from "@/helpers/polygonValidation";
import { useMessageValidators } from "@/hooks/useMessageValidations";
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
import { getItemSeverity, severityToColor } from "./validationCriteria";

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
  const { getFormatedExtraInfo } = useMessageValidators();

  const items = useMemo(() => (validation == null ? [] : parseV3ValidationData(validation)), [validation]);
  const totalItems = items.length;
  const failedCount = items.filter(i => !i.status).length;
  const hasDetails = totalItems > 0;

  return (
    <>
      <Flex justify="space-between" className="items-center gap-2">
        <Text textStyle="400" color="neutral.900" as="span" className="truncate">
          {polygon.polygonName}
        </Text>
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
        <Flex direction="column" ml={-6} gap={3} py={3} px={4} bg="neutral.200" mt={2.5} rounded={2.5}>
          <Box>
            <Text textStyle="300-bold" color="neutral.900" as="span">
              {t("{failed} out of {total}", { failed: failedCount, total: totalItems })}
            </Text>
            &nbsp;
            <Text textStyle="300" color="neutral.900" as="span">
              {t("Validation criteria are not met")}
            </Text>
          </Box>
          <List.Root gap="0" variant="plain" alignItems="baseline">
            {items.map(item => {
              const severity = getItemSeverity(item);
              const messages = getFormatedExtraInfo(item.extra_info, item.id);
              return (
                <List.Item key={item.id}>
                  <List.Indicator asChild color={severityToColor(severity)} boxSize={3}>
                    {severity === "success" ? (
                      <CheckApprovedIcon />
                    ) : severity === "warning" ? (
                      <InformationRequiredIcon />
                    ) : (
                      <RejectedIcon />
                    )}
                  </List.Indicator>
                  <Box>
                    <Text textStyle="300" color="neutral.900">
                      {t(item.label)}
                    </Text>
                    {messages.length > 0 && (
                      <Box mb={3}>
                        {messages.map((msg, idx) => (
                          <Text textStyle="200" color="neutral.800" key={`${item.id}-${idx}`}>
                            {msg}
                          </Text>
                        ))}
                      </Box>
                    )}
                  </Box>
                </List.Item>
              );
            })}
          </List.Root>
          <Box className="w-fit">
            <Button variant="borderless" size="small" onClick={() => onViewDetails?.(polygon)} className="w-fit">
              {t("View Details")}
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
        <Text textStyle="200-bold" color="neutral.700">
          {t("Polygon Analysed:")}
        </Text>
        <List.Root as="ul" pl={4} spaceY={1} ml={2} listStyleType="disc">
          {polygons.map(item => (
            <List.Item key={item.id} _marker={{ color: "neutral.900" }}>
              <ItemPolygon polygon={item} validation={polygonValidations.get(item.id)} onViewDetails={onViewDetails} />
            </List.Item>
          ))}
        </List.Root>
      </Box>
    </Flex>
  );
};

export default ValidationSection;
