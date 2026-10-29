import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { noop } from "lodash";
import { FC, useCallback, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MultiActionButton from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import { DownloadIcon, PlusIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import { SelectedFilter } from "@/redesignComponents/navigation/Toolbar/ToolBar.type";
import ToolbarTable from "@/redesignComponents/navigation/Toolbar/ToolbarTable/ToolbarTable";

import { PolygonFilterState } from "../../site/[uuid]/components/polygonFilter.constants";
import PolygonFilterDrawer from "../../site/[uuid]/components/PolygonFilterDrawer";

type PolygonReviewToolbarProps = {
  projectUuid?: string;
  polygonFilters: PolygonFilterState;
  activeFilterLabels: SelectedFilter[];
  onApplyFilters: (filters: PolygonFilterState) => void;
  onClearFilters: () => void;
};

const PolygonReviewToolbar: FC<PolygonReviewToolbarProps> = ({
  projectUuid,
  polygonFilters,
  activeFilterLabels,
  onApplyFilters,
  onClearFilters
}) => {
  const t = useT();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const openFilterDrawer = useCallback(() => setIsFilterDrawerOpen(true), []);

  return (
    <>
      <ToolbarTable
        className="!px-0"
        search={{ placeholder: t("Search polygons"), options: [] }}
        selectedFilters={activeFilterLabels}
        lockedMessage={projectUuid != null ? undefined : t("Select a project to search and filter polygons")}
        showClearFilters={activeFilterLabels.length > 0}
        onClearFilters={onClearFilters}
        onClickFilterButton={openFilterDrawer}
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
              <Button
                className="pointer-events-none"
                variant="secondary"
                size="small"
                leftIcon={<UploadIcon />}
                disabled
              >
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
      <PolygonFilterDrawer
        open={isFilterDrawerOpen}
        filters={polygonFilters}
        siteFilterProjectUuid={projectUuid}
        onApplyFilters={onApplyFilters}
        onClearFilters={onClearFilters}
        onOpenChange={setIsFilterDrawerOpen}
      />
    </>
  );
};

export default PolygonReviewToolbar;
