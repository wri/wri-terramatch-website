import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useMemo } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import CloseButton from "@/redesignComponents/actions/Buttons/CloseButton/CloseButton";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import ProgressBar from "@/redesignComponents/dataDisplay/Metrics/ProgressBar";
import { CheckApprovedIcon, ChevronRightIcon, InformationRequiredIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

export type OverlapFixPolygon = {
  id: string;
  name: string;
};
interface OverlapFixProps {
  open: boolean;
  onClose: () => void;
  polygonsFixed?: OverlapFixPolygon[];
  polygonsNotFixed?: OverlapFixPolygon[];
  onViewPolygon?: (polygonUuid: string) => void;
}

const PolygonNameList: FC<{ polygons: OverlapFixPolygon[]; onViewPolygon?: (polygonUuid: string) => void }> = ({
  polygons,
  onViewPolygon
}) => {
  const t = useT();

  if (polygons.length === 0) {
    return null;
  }

  return (
    <List.Root as="ul" ml={7} spaceY={3} listStyleType="disc">
      {polygons.map(polygon => (
        <List.Item key={polygon.id} _marker={{ color: "neutral.900" }}>
          <Flex className="w-full flex-row items-center justify-between gap-4">
            <Text textStyle="400" color="neutral.900">
              {polygon.name}
            </Text>
            <Button
              size="small"
              variant="secondary"
              onClick={() => onViewPolygon?.(polygon.id)}
              rightIcon={<ChevronRightIcon />}
            >
              {t("View Polygon")}
            </Button>
          </Flex>
        </List.Item>
      ))}
    </List.Root>
  );
};

const OverlapFix: FC<OverlapFixProps> = ({
  open,
  onClose,
  polygonsFixed = [],
  polygonsNotFixed = [],
  onViewPolygon
}) => {
  const t = useT();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const fixedCount = polygonsFixed.length;
  const notFixedCount = polygonsNotFixed.length;
  const showSuccessSection = fixedCount > 0;
  const showUnfixedSection = notFixedCount > 0;

  const notFixedSummaryLabel = useMemo(() => {
    if (notFixedCount === 1) {
      return t("1 Polygon couldn't be fixed");
    }
    return t("{count} Polygons couldn't be fixed", { count: notFixedCount });
  }, [notFixedCount, t]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      blocking
      size="large"
      header={
        <Flex className="w-full items-center justify-between">
          <Text textStyle="400-bold">{t("Overlap Fix Complete")}</Text>
          <CloseButton onClick={handleClose} />
        </Flex>
      }
      content={
        <Box px={4}>
          <Flex className="w-full flex-col gap-4">
            {showSuccessSection && (
              <Flex className="w-full flex-col gap-3">
                <Flex className="w-full items-center gap-3">
                  <ProgressBar progress={(fixedCount / (fixedCount + notFixedCount)) * 100} width="15.625rem" />
                  <Flex className="items-center justify-center gap-2">
                    <CheckApprovedIcon boxSize={4} color="primary.500" />
                    <Text as="span" color="neutral.700">
                      <Text as="span" textStyle="400-bold" color="primary.900">
                        {fixedCount}
                      </Text>{" "}
                      {t("of")} {fixedCount + notFixedCount}{" "}
                      <Text as="span" textStyle="400-bold" color="primary.900">
                        {t("successfully fixed")}
                      </Text>
                    </Text>
                  </Flex>
                </Flex>
                <Flex className="w-full items-center gap-2">
                  <Text textStyle="200-bold" color="neutral.700">
                    {t("Updated Polygons:")}
                  </Text>
                </Flex>
                <PolygonNameList polygons={polygonsFixed} onViewPolygon={onViewPolygon} />
              </Flex>
            )}

            {showSuccessSection && showUnfixedSection && <SimpleDivider />}

            {showUnfixedSection && (
              <Flex className="w-full flex-col gap-3">
                <Flex className="w-full items-center gap-2">
                  <InformationRequiredIcon boxSize={4} color="error.500" />
                  <Text textStyle="400-bold" color="neutral.900">
                    {notFixedSummaryLabel}
                  </Text>
                </Flex>

                <Flex className="flex-col gap-2">
                  <Text textStyle="200-bold" color="neutral.700">
                    {t("Polygons affected:")}
                  </Text>
                  <PolygonNameList polygons={polygonsNotFixed} onViewPolygon={onViewPolygon} />
                </Flex>

                <Flex className="flex-col gap-2">
                  <Text textStyle="200-bold" color="neutral.700">
                    {t("Why polygons cannot be automatically fixed?")}
                  </Text>
                  <Flex className="flex-col gap-1">
                    <Text textStyle="300" color="neutral.900">
                      {t("An overlap can be automatically fixed")}{" "}
                      <Text as="span" textStyle="300-bold" color="neutral.900">
                        only if both conditions are met
                      </Text>
                      :
                    </Text>
                    <List.Root as="ol" pl={5} spaceY={1} listStyleType="decimal" mb={2}>
                      <List.Item _marker={{ color: "neutral.900" }}>
                        <Text textStyle="300" color="neutral.900">
                          {t("Percentage of overlap (relative to the smaller polygon) ≤ 3.5%")}
                        </Text>
                      </List.Item>
                      <List.Item _marker={{ color: "neutral.900" }}>
                        <Text textStyle="300" color="neutral.900">
                          {t("Area of overlap (absolute size) ≤ 0.1 hectares")}
                        </Text>
                      </List.Item>
                    </List.Root>
                  </Flex>
                </Flex>

                <Flex className="flex-col gap-2">
                  <Text textStyle="200-bold" color="neutral.700">
                    {t("Here's what you can do to resolve it:")}
                  </Text>
                  <Box>
                    <List.Root as="ul" pl={5} spaceY={1} listStyleType="disc" mb={2}>
                      <List.Item _marker={{ color: "neutral.800" }}>
                        <Text textStyle="300" color="neutral.800">
                          {t("Edit the boundaries of each Polygon affected.")}
                        </Text>
                      </List.Item>
                      <List.Item _marker={{ color: "neutral.800" }}>
                        <Text textStyle="300" color="neutral.800">
                          {t(
                            "Download the Polygons affected, edit them in an external tool, i.e. Greenhouse, and re-upload to TerraMatch."
                          )}
                        </Text>
                      </List.Item>
                      <List.Item _marker={{ color: "neutral.800" }}>
                        <Text textStyle="300" color="neutral.800">
                          {t("If the issue persists,")}
                          <Button
                            size="small"
                            variant="borderless"
                            onClick={() =>
                              (window.location.href =
                                "mailto:info@terramatch.org?subject=Support%20Request%20for%20Overlap%20Fix")
                            }
                            className="!px-1"
                          >
                            {t("contact")}
                          </Button>
                          {t("the TerraMatch Support team.")}
                        </Text>
                      </List.Item>
                    </List.Root>
                  </Box>
                </Flex>
              </Flex>
            )}
          </Flex>
        </Box>
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "close",
              variant: "secondary",
              className: "w-fit",
              children: t("Close"),
              autoFocus: true,
              onClick: handleClose
            }
          ]}
        />
      }
    />
  );
};

export default OverlapFix;
