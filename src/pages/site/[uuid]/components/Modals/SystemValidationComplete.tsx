import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useMemo } from "react";

import type { ValidationDto } from "@/generated/v3/researchService/researchServiceSchemas";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";

import { PolygonTableRow } from "../PolygonTableRow";
import { mapValidationDtoToTagState } from "./validationCriteria";
import ValidationSection from "./ValidationSection";

export interface SystemValidationCompleteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  polygons: PolygonTableRow[];
  geometryPolygonUuids?: string[];
  onViewDetails?: (polygon: PolygonTableRow) => void;
  polygonValidations: Map<string, ValidationDto>;
  isLoadingResults?: boolean;
}
const SystemValidationComplete: FC<SystemValidationCompleteProps> = ({
  open,
  onOpenChange,
  polygons,
  geometryPolygonUuids,
  onViewDetails,
  polygonValidations,
  isLoadingResults = false
}) => {
  const t = useT();
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const polygonsWithResolvedValidation = useMemo(
    () =>
      polygons.map((polygon, index) => {
        const validationLookupId = geometryPolygonUuids?.[index] ?? polygon.id;
        const resolvedValidation =
          mapValidationDtoToTagState(polygonValidations.get(validationLookupId)) ?? polygon.validation;

        if (resolvedValidation === polygon.validation) {
          return polygon;
        }

        return { ...polygon, validation: resolvedValidation };
      }),
    [geometryPolygonUuids, polygons, polygonValidations]
  );

  const { approvalValidations, partiallyPassedValidations, failedValidations } = useMemo(() => {
    const approval: PolygonTableRow[] = [];
    const partial: PolygonTableRow[] = [];
    const failed: PolygonTableRow[] = [];

    for (const item of polygonsWithResolvedValidation) {
      if (item.validation === "passed") {
        approval.push(item);
      } else if (item.validation === "partially-passed") {
        partial.push(item);
      } else if (item.validation === "failed") {
        failed.push(item);
      }
    }

    return {
      approvalValidations: approval,
      partiallyPassedValidations: partial,
      failedValidations: failed
    };
  }, [polygonsWithResolvedValidation]);

  const hasValidationResults =
    approvalValidations.length > 0 || partiallyPassedValidations.length > 0 || failedValidations.length > 0;
  const showLoadingState = isLoadingResults && !hasValidationResults;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="large"
      header={<b className="text-theme-neutral-800">{t("System Validation Complete")}</b>}
      content={
        <Flex px={4} direction="column" gap={3}>
          {showLoadingState ? (
            <Flex alignItems="center" gap={2} py={2}>
              <LoadingIcon boxSize={5} color="primary.700" animation="spin 1s linear infinite" />
              <Text textStyle="400" color="neutral.800">
                {t("Loading validation results...")}
              </Text>
            </Flex>
          ) : (
            <>
              <ValidationSection
                polygons={approvalValidations}
                polygonValidations={polygonValidations}
                color="success.500"
                onViewDetails={onViewDetails}
              />
              {approvalValidations.length > 0 && partiallyPassedValidations.length > 0 && <SimpleDivider />}
              <ValidationSection
                polygons={partiallyPassedValidations}
                polygonValidations={polygonValidations}
                color="warning.500"
                onViewDetails={onViewDetails}
              />
              {partiallyPassedValidations.length > 0 && failedValidations.length > 0 && <SimpleDivider />}
              <ValidationSection
                polygons={failedValidations}
                polygonValidations={polygonValidations}
                color="error.500"
                onViewDetails={onViewDetails}
              />
            </>
          )}
        </Flex>
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "close",
              variant: "secondary",
              children: t("Close"),
              className: "w-fit",
              onClick: handleClose
            }
          ]}
        />
      }
    />
  );
};

export default SystemValidationComplete;
