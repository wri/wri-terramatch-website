import { Grid } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import type { FC } from "react";
import { useCallback, useState } from "react";

import { downloadPolygonGeoJson, formatFileName } from "@/components/elements/Map-mapbox/utils";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { DownloadIcon, EditIcon } from "@/redesignComponents/foundations/Icons";

type PopupFooterPolygonProps = {
  polygonUuid?: string;
  polygonName?: string;
};

const PopupFooterPolygon: FC<PopupFooterPolygonProps> = ({ polygonUuid, polygonName }) => {
  const t = useT();
  const [isDownloading, setIsDownloading] = useState(false);
  const canDownload = polygonUuid != null && polygonUuid !== "";

  const handleDownload = useCallback(async () => {
    if (!canDownload) {
      return;
    }
    try {
      setIsDownloading(true);
      const filename = polygonName != null && polygonName !== "" ? formatFileName(polygonName) : "polygon";
      await downloadPolygonGeoJson(polygonUuid, filename, { includeExtendedData: true });
    } finally {
      setIsDownloading(false);
    }
  }, [canDownload, polygonName, polygonUuid]);

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={3} width="100%">
      <Button
        variant="secondary"
        size="small"
        leftIcon={<DownloadIcon />}
        onClick={() => void handleDownload()}
        loading={isDownloading}
        disabled={!canDownload || isDownloading}
      >
        {t("Download")}
      </Button>
      <Button variant="secondary" size="small" leftIcon={<EditIcon />}>
        {t("Edit")}
      </Button>
      <Button variant="primary" size="small">
        {t("Submit")}
      </Button>
    </Grid>
  );
};
export default PopupFooterPolygon;
