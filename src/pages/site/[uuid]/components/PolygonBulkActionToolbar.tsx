import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { showToast } from "@worldresources/wri-design-systems";
import { FC, useState } from "react";

import { usePolygonEditDrawer } from "@/context/polygonEditDrawer.provider";
import { LoadingIcon } from "@/redesignComponents/foundations/Icons";
import BulkActionToolbar from "@/redesignComponents/navigation/Toolbar/BulkActionToolbar";

import SystemValidationComplete from "./Modals/SystemValidationComplete";
import { PolygonTableRow } from "./PolygonTableRow";

export type PolygonBulkActionToolbarProps = {
  visible: boolean;
  itemCount: number;
  isBulkEditDrawerOpen?: boolean;
  submitLabel?: string;
  isDownloading?: boolean;
  onCancel: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onEdit: () => void;
  onSubmit: () => void;
  onViewPolygonDetails?: (polygon: PolygonTableRow) => void;
  showTooltip: boolean;
  polygons: PolygonTableRow[];
};

const PolygonBulkActionToolbar: FC<PolygonBulkActionToolbarProps> = ({
  visible,
  itemCount,
  isBulkEditDrawerOpen = false,
  submitLabel = "Submit",
  isDownloading = false,
  onCancel,
  onDelete,
  onDownload,
  onEdit,
  onSubmit,
  onViewPolygonDetails,
  polygons,
  showTooltip
}) => {
  const { isOpen: isPolygonEditDrawerOpen } = usePolygonEditDrawer();
  const t = useT();
  const [isSystemValidationCompleteModalOpen, setIsSystemValidationCompleteModalOpen] = useState(false);
  if (!visible || isPolygonEditDrawerOpen || isBulkEditDrawerOpen) {
    return null;
  }

  return (
    <Box position={"fixed"} zIndex={"100"} bottom={0} left={3} right={3}>
      <SystemValidationComplete
        polygons={polygons}
        open={isSystemValidationCompleteModalOpen}
        onOpenChange={setIsSystemValidationCompleteModalOpen}
        onViewDetails={polygon => {
          setIsSystemValidationCompleteModalOpen(false);
          onViewPolygonDetails?.(polygon);
        }}
      />
      <BulkActionToolbar
        ButtonCancel={{
          children: t("Cancel"),
          onClick: onCancel
        }}
        ButtonDelete={{
          children: t("Delete"),
          onClick: onDelete
        }}
        items={String(itemCount)}
        tertiaryButtonProps={{
          children: t("Download"),
          loading: isDownloading,
          disabled: isDownloading,
          onClick: onDownload
        }}
        secondaryButtonProps={{
          children: "Run Validation",
          onClick: () => {
            setTimeout(() => {
              setIsSystemValidationCompleteModalOpen(true);
            }, 5000);
            showToast({
              label: t("Validating Polygons..."),
              type: "info",
              placement: "bottom-end",
              closableLabel: t("Close"),
              icon: <LoadingIcon boxSize={7} color="primary.700" animation="spin 1s linear infinite" />
            });
          }
        }}
        primaryButtonProps={{
          children: itemCount > 1 ? t("Edit Details") : t("Edit"),
          onClick: onEdit
        }}
        submitButtonProps={{
          children: t(submitLabel),
          onClick: onSubmit
        }}
        {...(showTooltip && {
          tooltipContent: (
            <Box>
              <Text color="neutral.200" textStyle={"300"} textAlign={"center"}>
                {t("Auto-fix isn’t available for this selection.")}
              </Text>
              <Text color="neutral.200" textStyle={"300"} textAlign={"center"}>
                {t("Fix the overlap manually.")}
              </Text>
            </Box>
          )
        })}
      />
    </Box>
  );
};

export default PolygonBulkActionToolbar;
