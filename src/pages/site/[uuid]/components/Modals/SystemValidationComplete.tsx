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
  onViewDetails?: (polygon: PolygonTableRow) => void;
  polygonValidations: Map<string, ValidationDto>;
  isLoadingResults?: boolean;
  pendingValidationPolygonIds?: string[];
  modal?: boolean;
  restoreFocus?: boolean;
  trapFocus?: boolean;
}
const SystemValidationComplete: FC<SystemValidationCompleteProps> = ({
  open,
  onOpenChange,
  polygons,
  onViewDetails,
  polygonValidations,
  isLoadingResults = false,
  pendingValidationPolygonIds = [],
  modal = true,
  restoreFocus = true,
  trapFocus = false
}) => {
  const t = useT();
  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const pendingValidationIds = useMemo(
    () => new Set(pendingValidationPolygonIds.filter(id => id !== "")),
    [pendingValidationPolygonIds]
  );

  const polygonsWithResolvedValidation = useMemo(
    () =>
      polygons.reduce<PolygonTableRow[]>((resolvedPolygons, polygon) => {
        if (pendingValidationIds.has(polygon.id)) {
          return resolvedPolygons;
        }

        const resolvedValidation = mapValidationDtoToTagState(polygonValidations.get(polygon.id));
        if (resolvedValidation == null) {
          return resolvedPolygons;
        }

        resolvedPolygons.push(
          resolvedValidation === polygon.validation ? polygon : { ...polygon, validation: resolvedValidation }
        );
        return resolvedPolygons;
      }, []),
    [pendingValidationIds, polygons, polygonValidations]
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
  const isAwaitingFreshResults = polygons.some(polygon => pendingValidationIds.has(polygon.id));
  const showLoadingState = isAwaitingFreshResults || (isLoadingResults && !hasValidationResults);

  return (
    <Modal
      modal={modal}
      restoreFocus={restoreFocus}
      trapFocus={trapFocus}
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
          ) : hasValidationResults ? (
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
          ) : (
            <Text textStyle="400" color="neutral.800" py={2}>
              {t("No validation results are available yet. Please try running validation again.")}
            </Text>
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
