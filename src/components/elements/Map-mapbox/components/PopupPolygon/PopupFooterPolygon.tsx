import { Grid } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import type { FC } from "react";
import { useCallback } from "react";

import { downloadPolygonGeoJson, formatFileName } from "@/components/elements/Map-mapbox/utils";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { DownloadIcon, EditIcon } from "@/redesignComponents/foundations/Icons";

import type { TooltipType } from "../../Map.d";

type PopupFooterPolygonProps = {
  polygonUuid?: string;
  polygonName?: string;
  submitDisabled?: boolean;
  onSubmit?: () => Promise<void>;
  onEdit?: () => void;
  tooltipType?: TooltipType;
};

const PopupFooterPolygon: FC<PopupFooterPolygonProps> = ({
  polygonUuid,
  polygonName,
  submitDisabled = false,
  onSubmit,
  onEdit,
  tooltipType
}) => {
  const t = useT();
  const canDownload = polygonUuid != null && polygonUuid !== "";

  const handleDownload = useCallback(async () => {
    if (!canDownload) {
      return;
    }
    const filename = polygonName != null && polygonName !== "" ? formatFileName(polygonName) : "polygon";
    await downloadPolygonGeoJson(polygonUuid, filename, { includeExtendedData: true });
  }, [canDownload, polygonName, polygonUuid]);

  const handleSubmit = useCallback(async () => {
    if (submitDisabled || onSubmit == null) {
      return;
    }
    await onSubmit();
  }, [onSubmit, submitDisabled]);

  return (
    <Grid templateColumns={tooltipType === "view" ? "repeat(2, 1fr)" : "repeat(3, 1fr)"} gap={3} width="100%">
      {tooltipType === "view" ? (
        <>
          <Button variant="secondary" size="small">
            {t("Close")}
          </Button>
          <Button variant="primary" size="small">
            {t("View details")}
          </Button>
        </>
      ) : (
        <>
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
          <Button variant="primary" size="small" onClick={() => void handleSubmit()} disabled={submitDisabled}>
            {t("Submit")}
          </Button>
        </>
      )}
    </Grid>
  );
};
export default PopupFooterPolygon;
