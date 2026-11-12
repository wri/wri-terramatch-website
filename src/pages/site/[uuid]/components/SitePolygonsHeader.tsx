import { useT } from "@transifex/react";
import { FC, PropsWithChildren } from "react";

import PageItem from "@/components/extensive/PageElements/PageItem/PageItem";
import { DownloadIcon, PlusIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";

import { SITE_POLYGON_TAB_HEADER_ID } from "../constants/sitePolygonMapSizing";

type SitePolygonsHeaderProps = {
  isAdmin: boolean;
  isDeletedAuditView: boolean;
  isDownloadingAll: boolean;
  isDownloadAllDisabled: boolean;
  onDownloadAll: () => void;
  onDrawPolygon: () => void;
  onUpload: () => void;
};

/** "Polygons" title with Download All, Upload Monitoring Plots and Add actions; children render below it. */
const SitePolygonsHeader: FC<PropsWithChildren<SitePolygonsHeaderProps>> = ({
  isAdmin,
  isDeletedAuditView,
  isDownloadingAll,
  isDownloadAllDisabled,
  onDownloadAll,
  onDrawPolygon,
  onUpload,
  children
}) => {
  const t = useT();

  return (
    <PageItem
      title={t("Polygons")}
      className="scroll-mt-[5.5rem]"
      flexProps={{ width: "100%", id: SITE_POLYGON_TAB_HEADER_ID }}
      downloadButtonProps={{
        variant: "secondary",
        size: "small",
        children: t("Download All"),
        leftIcon: <DownloadIcon />,
        loading: isDownloadingAll,
        disabled: isDownloadAllDisabled,
        onClick: onDownloadAll
      }}
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
