import { useT } from "@transifex/react";
import { FC, PropsWithChildren } from "react";

import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import MultiActionButton, {
  IMultiActionButtonProps
} from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import { DownloadIcon, PlusIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";

import { SITE_POLYGON_TAB_HEADER_ID } from "../constants/sitePolygonMapSizing";
import type { PolygonDownloadFormat } from "../hooks/useSitePolygonBulkActions";

type SitePolygonsHeaderProps = {
  isAdmin: boolean;
  isDeletedAuditView: boolean;
  isDownloadingAll: boolean;
  isDownloadAllDisabled: boolean;
  currentViewCount: number;
  wholeEntityCount: number;
  onDownloadCurrentView: (format: PolygonDownloadFormat) => void;
  onDownloadWholeEntity: (format: PolygonDownloadFormat) => void;
  onDrawPolygon: () => void;
  onUpload: () => void;
};

type DownloadMenuOption = IMultiActionButtonProps["otherActions"][number];

/** "Polygons" title with Download All, Upload Monitoring Plots and Add actions; children render below it. */
const SitePolygonsHeader: FC<PropsWithChildren<SitePolygonsHeaderProps>> = ({
  isAdmin,
  isDeletedAuditView,
  isDownloadingAll,
  isDownloadAllDisabled,
  currentViewCount,
  wholeEntityCount,
  onDownloadCurrentView,
  onDownloadWholeEntity,
  onDrawPolygon,
  onUpload,
  children
}) => {
  const t = useT();

  // Section titles are disabled options so they read as headers and can't be clicked.
  const downloadOptions: DownloadMenuOption[] = [
    {
      label: (
        <span className="polygon-download-section-title font-bold text-theme-neutral-900">
          {t("Current view {count} polygons", { count: currentViewCount })}
        </span>
      ),
      value: "current-header",
      disabled: true,
      onClick: () => {}
    },
    { label: t("Attributes (.csv)"), value: "current-csv", onClick: () => onDownloadCurrentView("csv") },
    { label: t("Polygons (.geojson)"), value: "current-geojson", onClick: () => onDownloadCurrentView("geojson") },
    {
      label: (
        <span className="polygon-download-section-title font-bold text-theme-neutral-900">
          {t("Whole project {count} polygons", { count: wholeEntityCount })}
        </span>
      ),
      value: "whole-header",
      disabled: true,
      onClick: () => {}
    },
    { label: t("Attributes (.csv)"), value: "whole-csv", onClick: () => onDownloadWholeEntity("csv") },
    { label: t("Polygons (.geojson)"), value: "whole-geojson", onClick: () => onDownloadWholeEntity("geojson") }
  ];

  return (
    <PageItem
      title={t("Polygons")}
      className="scroll-mt-[5.5rem]"
      flexProps={{ width: "100%", id: SITE_POLYGON_TAB_HEADER_ID }}
      downloadSlot={
        <MultiActionButton
          variant="secondary"
          size="small"
          mainActionLabel={t("Download All")}
          mainActionLeftIcon={<DownloadIcon />}
          mainActionOnClick={() => {}}
          disabled={isDownloadAllDisabled || isDownloadingAll}
          otherActions={downloadOptions}
        />
      }
      buttonProps={
        isAdmin
          ? {
              variant: "secondary",
              size: "small",
              children: t("Upload Monitoring Plots"),
              leftIcon: <UploadIcon />,
              disabled: true
            }
          : undefined
      }
      multiActionButtonProps={
        isDeletedAuditView
          ? undefined
          : {
              mainActionLabel: t("Add"),
              size: "small",
              mainActionLeftIcon: <PlusIcon />,
              mainActionOnClick: onDrawPolygon,
              otherActions: [
                {
                  label: t("Draw Polygon"),
                  onClick: onDrawPolygon,
                  value: "draw-polygon"
                },
                {
                  label: t("Upload"),
                  onClick: onUpload,
                  value: "upload"
                }
              ],
              variant: "primary"
            }
      }
    >
      {children}
    </PageItem>
  );
};

export default SitePolygonsHeader;
