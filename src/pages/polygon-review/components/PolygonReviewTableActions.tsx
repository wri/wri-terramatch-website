import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { noop } from "lodash";
import { FC, PropsWithChildren } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MultiActionButton from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import { DownloadIcon, PlusIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";

const LockedActionTooltip: FC<PropsWithChildren> = ({ children }) => {
  const t = useT();

  return (
    <Tooltip content={t("Select a project to download or add polygons")} position="top">
      {/* Disabled buttons swallow pointer events, so the wrapper receives the hover for the tooltip. */}
      <Flex as="span" className="cursor-not-allowed">
        {children}
      </Flex>
    </Tooltip>
  );
};

/** Download All, Upload Monitoring Plots and Add; disabled until the project-scoped workspace lands. */
const PolygonReviewTableActions: FC = () => {
  const t = useT();

  return (
    <Flex justify="flex-end" align="center" gap={2}>
      <LockedActionTooltip>
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
      <LockedActionTooltip>
        <Button className="pointer-events-none" variant="secondary" size="small" leftIcon={<UploadIcon />} disabled>
          {t("Upload Monitoring Plots")}
        </Button>
      </LockedActionTooltip>
      <LockedActionTooltip>
        <MultiActionButton
          className="pointer-events-none"
          variant="primary"
          size="small"
          mainActionLabel={t("Add")}
          mainActionLeftIcon={<PlusIcon />}
          mainActionOnClick={noop}
          otherActions={[]}
          disabled
        />
      </LockedActionTooltip>
    </Flex>
  );
};

export default PolygonReviewTableActions;
