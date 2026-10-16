import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Search } from "@worldresources/wri-design-systems";
import { noop } from "lodash";
import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import MultiActionButton from "@/redesignComponents/actions/Buttons/MultiActionButton/MultiActionButton";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import { DownloadIcon, FilterIcon, LockIcon, PlusIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import Toolbar from "@/redesignComponents/navigation/Toolbar/Toolbar";

/**
 * Polygon search, Level 2 filters and polygon actions, all locked until a project is selected.
 * TM-3989 / the project-scoped workspace replace the locked controls once a project can be picked.
 */
const PolygonReviewToolbar: FC = () => {
  const t = useT();

  return (
    <Toolbar
      className="px-0"
      contentLeft={
        <Flex className="items-center gap-4">
          <Search placeholder={t("Search polygons")} options={[]} disabled />
          <SimpleDivider backgroundColor="neutral.500" className="!h-4 !w-[0.0625rem]" />
          <Button variant="secondary" size="small" leftIcon={<FilterIcon />} disabled>
            {t("Add Filter")}
          </Button>
          <Flex className="items-center gap-1">
            <LockIcon boxSize="0.875rem" color="neutral.700" />
            <Text textStyle="200" color="neutral.700">
              {t("Select a project to search and filter polygons")}
            </Text>
          </Flex>
        </Flex>
      }
      contentRight={
        <Tooltip content={t("Select a project to download or add polygons")} position="top">
          {/* Disabled buttons swallow pointer events, so the wrapper receives the hover for the tooltip. */}
          <Box tabIndex={0} className="flex cursor-not-allowed items-center gap-4 [&_button]:pointer-events-none">
            <MultiActionButton
              variant="secondary"
              size="small"
              mainActionLabel={t("Download All")}
              mainActionLeftIcon={<DownloadIcon />}
              mainActionOnClick={noop}
              otherActions={[]}
              disabled
            />
            <SimpleDivider className="!h-7 !w-[0.063rem]" />
            <Button variant="secondary" size="small" leftIcon={<UploadIcon />} disabled>
              {t("Upload Monitoring Plots")}
            </Button>
            <MultiActionButton
              variant="primary"
              size="small"
              mainActionLabel={t("Add")}
              mainActionLeftIcon={<PlusIcon />}
              mainActionOnClick={noop}
              otherActions={[]}
              disabled
            />
          </Box>
        </Tooltip>
      }
    />
  );
};

export default PolygonReviewToolbar;
