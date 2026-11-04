import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { noop } from "lodash";
import { FC, PropsWithChildren } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MultiActionButton from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import { DownloadIcon, PlusIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";

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

type PolygonReviewTableActionsProps = {
  isProjectSelected: boolean;
  isSingleSiteSelected: boolean;
  onDrawPolygon: () => void;
  onUpload: () => void;
};

/** Download All, Upload Monitoring Plots and Add (draw / upload polygons). */
const PolygonReviewTableActions: FC<PolygonReviewTableActionsProps> = ({
  isProjectSelected,
  isSingleSiteSelected,
  onDrawPolygon,
  onUpload
}) => {
  const t = useT();
  const projectLockedMessage = isProjectSelected ? undefined : t("Select a project to download or add polygons");
  const addLockedMessage =
    projectLockedMessage ?? (isSingleSiteSelected ? undefined : t("Select a single site to draw or upload polygons."));
  const isAddDisabled = addLockedMessage != null;

  return (
    <Flex justify="flex-end" align="center" gap={2}>
      <LockedActionTooltip message={t("Select a project to download or add polygons")}>
        <MultiActionButton
          className="pointer-events-none"
          variant="secondary"
          size="small"
          mainActionLabel={t("Download All")}
          mainActionLeftIcon={<DownloadIcon />}
          mainActionOnClick={noop}
          otherActions={[]}
          disabled
        />
      </LockedActionTooltip>
      <LockedActionTooltip message={t("Select a project to download or add polygons")}>
        <Button className="pointer-events-none" variant="secondary" size="small" leftIcon={<UploadIcon />} disabled>
          {t("Upload Monitoring Plots")}
        </Button>
      </LockedActionTooltip>
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
    </Flex>
  );
};

export default PolygonReviewTableActions;
