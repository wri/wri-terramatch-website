import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { noop } from "lodash";
import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MultiActionButton from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import { DownloadIcon, PlusIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

/**
 * Polygon search, Level 2 filters and polygon actions, all locked until a project is selected.
 * TM-3989 / the project-scoped workspace replace the locked controls once a project can be picked.
 */
const PolygonReviewToolbar: FC = () => {
  const t = useT();

  return (
    <ToolbarTable
      className="!px-0"
      search={{ placeholder: t("Search polygons"), options: [] }}
      selectedFilters={[]}
      lockedMessage={t("Select a project to search and filter polygons")}
      showClearFilters={false}
      onClearFilters={noop}
      actions={
        <Tooltip content={t("Select a project to download or add polygons")} position="top">
          {/* Disabled buttons swallow pointer events, so the wrapper receives the hover for the tooltip. */}
          <Flex as="span" className="cursor-not-allowed items-center gap-4">
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
            <SimpleDivider className="!h-7 !w-[0.063rem]" />
            <Button className="pointer-events-none" variant="secondary" size="small" leftIcon={<UploadIcon />} disabled>
              {t("Upload Monitoring Plots")}
            </Button>
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
          </Flex>
        </Tooltip>
      }
    />
  );
};

export default PolygonReviewToolbar;
