import { Flex, Grid } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import type { FC } from "react";
import { useCallback, useMemo } from "react";

import { downloadPolygonGeoJson, formatFileName } from "@/components/elements/Map-mapbox/utils";
import {
  closePolygonProgressToast,
  completePolygonProgressToast,
  getDownloadingPolygonsProgressLabel,
  getPolygonOperationToastLabels,
  POLYGON_TOAST_IDS,
  showPolygonErrorToast,
  showPolygonProgressToast
} from "@/pages/site/[uuid]/utils/polygonOperationToasts";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MultiActionButton from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import { DownloadIcon, EditIcon, InfoIcon } from "@/redesignComponents/foundations/Icons";
import { wrapToolbarInfoTooltipContent } from "@/redesignComponents/navigation/Toolbar/ToolbarInfoTooltipContent";

import type { TooltipType } from "../../Map.d";

type PopupFooterPolygonProps = {
  polygonUuid?: string;
  polygonName?: string;
  submitDisabled?: boolean;
  onSubmit?: () => Promise<void>;
  onEdit?: () => void;
  onClose?: () => void;
  onViewDetails?: () => void;
  viewDetailsDisabled?: boolean;
  submitDisabledTooltip?: string;
  tooltipType?: TooltipType;
  isAdminReview?: boolean;
  approveDisabled?: boolean;
  approveDisabledTooltip?: string;
  onApprove?: () => void;
  onRequestInformation?: () => void;
  onRunValidation?: () => void;
};

const PopupFooterPolygon: FC<PopupFooterPolygonProps> = ({
  polygonUuid,
  polygonName,
  submitDisabled = false,
  onSubmit,
  onEdit,
  onClose,
  onViewDetails,
  viewDetailsDisabled = false,
  submitDisabledTooltip,
  tooltipType,
  isAdminReview = false,
  approveDisabled = false,
  approveDisabledTooltip,
  onApprove,
  onRequestInformation,
  onRunValidation
}) => {
  const t = useT();
  const toastLabels = useMemo(() => getPolygonOperationToastLabels(t), [t]);
  const canDownload = polygonUuid != null && polygonUuid !== "";
  const canRunValidation = polygonUuid != null && polygonUuid !== "" && onRunValidation != null;

  const handleDownload = useCallback(async () => {
    if (!canDownload) {
      return;
    }

    const filename = polygonName != null && polygonName !== "" ? formatFileName(polygonName) : "polygon";

    showPolygonProgressToast(t, getDownloadingPolygonsProgressLabel(t, 1), POLYGON_TOAST_IDS.downloading);

    try {
      await downloadPolygonGeoJson(polygonUuid, filename, { includeExtendedData: true });
      completePolygonProgressToast(POLYGON_TOAST_IDS.downloading, toastLabels.downloadingPolygonsComplete);
    } catch {
      closePolygonProgressToast(POLYGON_TOAST_IDS.downloading);
      showPolygonErrorToast(t("Error downloading polygon"));
    }
  }, [canDownload, polygonName, polygonUuid, t, toastLabels]);

  const handleSubmit = useCallback(async () => {
    if (submitDisabled || onSubmit == null) {
      return;
    }
    await onSubmit();
  }, [onSubmit, submitDisabled]);

  if (tooltipType === "view") {
    return (
      <Grid templateColumns="repeat(2, 1fr)" gap={3} width="100%">
        <Button variant="secondary" size="small" onClick={onClose}>
          {t("Close")}
        </Button>
        <Button
          variant="primary"
          size="small"
          onClick={onViewDetails}
          disabled={viewDetailsDisabled || onViewDetails == null}
        >
          {t("View details")}
        </Button>
      </Grid>
    );
  }

  if (isAdminReview) {
    return (
      <Grid templateColumns="repeat(3, 1fr)" gap={3} width="100%">
        <Button variant="secondary" size="small" onClick={onRunValidation} disabled={!canRunValidation}>
          {t("Run Validation")}
        </Button>
        <Button variant="secondary" size="small" leftIcon={<EditIcon />} onClick={onEdit}>
          {t("Edit")}
        </Button>
        <Flex alignItems="center" gap={1.5} minWidth={0}>
          <MultiActionButton
            mainActionLabel={t("Review")}
            mainActionOnClick={() => {}}
            otherActions={[
              {
                label: t("Approve"),
                value: "approve",
                disabled: approveDisabled,
                onClick: onApprove ?? (() => {})
              },
              {
                label: t("Request information"),
                value: "request-information",
                onClick: onRequestInformation ?? (() => {})
              }
            ]}
            variant="primary"
            size="small"
            className="min-w-0 flex-1"
          />
          {approveDisabled && approveDisabledTooltip != null && (
            <Tooltip content={wrapToolbarInfoTooltipContent(approveDisabledTooltip)} position="top">
              <InfoIcon height="1rem" width="1rem" color="neutral.800" />
            </Tooltip>
          )}
        </Flex>
      </Grid>
    );
  }

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={3} width="100%">
      <Button
        variant="secondary"
        size="small"
        leftIcon={<DownloadIcon />}
        onClick={() => void handleDownload()}
        disabled={!canDownload}
      >
        {t("Download")}
      </Button>
      <Button variant="secondary" size="small" leftIcon={<EditIcon />} onClick={onEdit}>
        {t("Edit")}
      </Button>
      <Flex alignItems="center" gap={1.5} minWidth={0}>
        <Button
          variant="primary"
          size="small"
          onClick={() => void handleSubmit()}
          disabled={submitDisabled}
          className="min-w-0 flex-1"
        >
          {t("Submit")}
        </Button>
        {submitDisabled && submitDisabledTooltip != null && (
          <Tooltip content={wrapToolbarInfoTooltipContent(submitDisabledTooltip)} position="top">
            <InfoIcon height="1rem" width="1rem" color="neutral.800" />
          </Tooltip>
        )}
      </Flex>
    </Grid>
  );
};
export default PopupFooterPolygon;
