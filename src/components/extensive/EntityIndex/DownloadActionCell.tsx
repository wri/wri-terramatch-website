import { Box } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useState } from "react";

import ActionCell from "@/redesignComponents/dataDisplay/Table/components/ActionCell";
import { DownloadIcon } from "@/redesignComponents/foundations/Icons";

type DownloadActionCellProps = {
  /** Performs the download; expected to handle its own toasts and errors. */
  onDownload: () => Promise<void>;
  ariaLabel?: string;
};

/** Row "Download" action used by the index tables on mobile in place of "Edit". */
const DownloadActionCell: FC<DownloadActionCellProps> = ({ onDownload, ariaLabel }) => {
  const t = useT();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(async () => {
    setIsDownloading(true);
    await onDownload();
    setIsDownloading(false);
  }, [onDownload]);

  return (
    <Box pr="1.5625rem">
      <ActionCell
        button={{
          children: t("Download"),
          "aria-label": ariaLabel,
          onClick: handleDownload,
          disabled: isDownloading,
          loading: isDownloading,
          leftIcon: <DownloadIcon />
        }}
      />
    </Box>
  );
};

export default DownloadActionCell;
