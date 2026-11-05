import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, PropsWithChildren, useCallback, useMemo } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MultiActionButton from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import { DownloadIcon, PlusIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";

import { usePolygonGeoJsonExport } from "../hooks/usePolygonGeoJsonExport";

type LockedActionTooltipProps = {
  message?: string;
};

const LockedActionTooltip: FC<PropsWithChildren<LockedActionTooltipProps>> = ({ message, children }) => {
  if (message == null) return <>{children}</>;

  return (
    <Tooltip content={message} position="top">
      {/* Disabled buttons swallow pointer events, so the wrapper receives the hover for the tooltip. */}
      <Flex as="span" className="cursor-not-allowed">
        {children}
      </Flex>
    </Tooltip>
  );
};

type DownloadOptionLabelProps = {
  title: string;
  caption: string;
};

const DownloadOptionLabel: FC<DownloadOptionLabelProps> = ({ title, caption }) => (
  <Flex direction="column" align="flex-start" className="max-w-[12rem]">
    <Text as="span" textStyle="300" color="neutral.900" className="whitespace-normal text-left">
      {title}
    </Text>
    <Text as="span" textStyle="200" color="neutral.600" className="w-full truncate text-left">
      {caption}
    </Text>
  </Flex>
);

export type PolygonReviewSiteOption = {
  value: string;
  label: string;
};

type PolygonReviewTableActionsProps = {
  projectUuid?: string;
  projectPolygonCount?: number;
  sitePolygonCount?: number;
  sites: PolygonReviewSiteOption[];
  isSingleSiteSelected: boolean;
  isDeletedAuditView: boolean;
  onDrawPolygon: () => void;
  onUpload: () => void;
};

/** Download All (project / site GeoJSON exports), Upload Monitoring Plots and Add (draw / upload polygons). */
const PolygonReviewTableActions: FC<PolygonReviewTableActionsProps> = ({
  projectUuid,
  projectPolygonCount,
  sitePolygonCount,
  sites,
  isSingleSiteSelected,
  isDeletedAuditView,
  onDrawPolygon,
  onUpload
}) => {
  const t = useT();
  const isProjectSelected = projectUuid != null;
  const projectLockedMessage = isProjectSelected ? undefined : t("Select a project to download or add polygons");
  const downloadLockedMessage = isProjectSelected ? undefined : t("Select a project or site to download polygons.");
  const addLockedMessage = isSingleSiteSelected ? undefined : t("Select a single site to draw or upload polygons.");
  const isAddDisabled = addLockedMessage != null;

  const siteUuids = useMemo(() => sites.map(({ value }) => value), [sites]);
  const hasSiteFilter = isProjectSelected && siteUuids.length > 0;

  const { startExport, isExporting } = usePolygonGeoJsonExport(projectUuid);
  const exportProject = useCallback(() => {
    if (projectUuid != null) void startExport({ projectUuids: [projectUuid] }, projectPolygonCount);
  }, [projectPolygonCount, projectUuid, startExport]);
  const exportSites = useCallback(
    () => void startExport({ siteUuids }, sitePolygonCount),
    [sitePolygonCount, siteUuids, startExport]
  );

  const downloadActions = useMemo(() => {
    const polygonCountCaption = (count: number | undefined) =>
      count === 1 ? t("1 polygon") : t("{count} polygons", { count: count?.toLocaleString() ?? "-" });
    const projectAction = {
      label: (
        <DownloadOptionLabel
          title={t("Project polygons (GeoJSON)")}
          caption={polygonCountCaption(projectPolygonCount)}
        />
      ),
      onClick: exportProject,
      value: "project-polygons"
    };
    if (!hasSiteFilter) return [projectAction];

    const formattedSiteCount = sitePolygonCount?.toLocaleString() ?? "-";
    const siteCaption =
      sites.length === 1
        ? sitePolygonCount === 1
          ? t("{site} · 1 polygon", { site: sites[0].label })
          : t("{site} · {count} polygons", { site: sites[0].label, count: formattedSiteCount })
        : t("{siteCount} sites · {count} polygons", { siteCount: sites.length, count: formattedSiteCount });
    return [
      projectAction,
      {
        label: <DownloadOptionLabel title={t("Site polygons (GeoJSON)")} caption={siteCaption} />,
        onClick: exportSites,
        value: "site-polygons"
      }
    ];
  }, [exportProject, exportSites, hasSiteFilter, projectPolygonCount, sitePolygonCount, sites, t]);
  const isDownloadDisabled = downloadLockedMessage != null || isExporting;

  return (
    <Flex justify="flex-end" align="center" gap={2}>
      <LockedActionTooltip message={downloadLockedMessage}>
        <MultiActionButton
          className={downloadLockedMessage != null ? "pointer-events-none" : undefined}
          variant="secondary"
          size="small"
          mainActionLabel={t("Download All")}
          mainActionLeftIcon={<DownloadIcon />}
          mainActionOnClick={exportProject}
          otherActions={downloadActions}
          disabled={isDownloadDisabled}
        />
      </LockedActionTooltip>
      <LockedActionTooltip message={projectLockedMessage}>
        <Button className="pointer-events-none" variant="secondary" size="small" leftIcon={<UploadIcon />} disabled>
          {t("Upload Monitoring Plots")}
        </Button>
      </LockedActionTooltip>
      {!isDeletedAuditView && (
        <LockedActionTooltip message={addLockedMessage}>
          <MultiActionButton
            className={isAddDisabled ? "pointer-events-none" : undefined}
            variant="primary"
            size="small"
            mainActionLabel={t("Add")}
            mainActionLeftIcon={<PlusIcon />}
            mainActionOnClick={onDrawPolygon}
            otherActions={[
              { label: t("Draw Polygon"), onClick: onDrawPolygon, value: "draw-polygon" },
              { label: t("Upload"), onClick: onUpload, value: "upload" }
            ]}
            disabled={isAddDisabled}
          />
        </LockedActionTooltip>
      )}
    </Flex>
  );
};

export default PolygonReviewTableActions;
