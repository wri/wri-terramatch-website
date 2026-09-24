import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, ReactNode, useMemo } from "react";

import { NurseryFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import Tooltip from "@/redesignComponents/actions/Tooltip/Tooltip";
import {
  InfoIcon,
  NurseryBuildingIcon,
  NurseryExpandingIcon,
  NurseryManagingIcon
} from "@/redesignComponents/foundations/Icons";

type NurseryTypeConfig = { icon: ReactNode; label: string; tooltip: string };

const useNurseryTypeMap = (): Record<string, NurseryTypeConfig> => {
  const t = useT();
  return useMemo(
    () => ({
      expanding: {
        icon: <NurseryExpandingIcon className="text-theme-secondary-800 h-8 w-8" />,
        label: t("Nursery Expansion"),
        tooltip: t(
          "An existing nursery that increases its production capacity for the project, such as by adding infrastructure, expanding structures, or increasing seedling output."
        )
      },
      building: {
        icon: <NurseryBuildingIcon className="text-theme-secondary-800 h-8 w-8" />,
        label: t("New Nursery"),
        tooltip: t(
          "A nursery that is newly established, including setting up infrastructure, sourcing materials, and starting seedling production."
        )
      },
      managing: {
        icon: <NurseryManagingIcon className="text-theme-secondary-800 h-8 w-8" />,
        label: t("Co-Managed Nursery"),
        tooltip: t(
          "A nursery jointly operated with a community or partner, where the organization might be supporting maintenance, production management, and quality control to build skills or economic opportunities or any other activity."
        )
      },
      "new-nursery": {
        icon: <NurseryBuildingIcon className="text-theme-secondary-800 h-8 w-8" />,
        label: t("New Nursery"),
        tooltip: t(
          "A nursery that is newly established, including setting up infrastructure, sourcing materials, and starting seedling production."
        )
      },
      "co-managed-nursery": {
        icon: <NurseryManagingIcon className="text-theme-secondary-800 h-8 w-8" />,
        label: t("Co-managed Nursery"),
        tooltip: t(
          "A nursery jointly operated with a community or partner, where the organization might be supporting maintenance, production management, and quality control to build skills or economic opportunities or any other activity."
        )
      },
      "nursery-expansion": {
        icon: <NurseryExpandingIcon className="text-theme-secondary-800 h-8 w-8" />,
        label: t("Nursery Expansion"),
        tooltip: t(
          "An existing nursery that increases its production capacity for the project, such as by adding infrastructure, expanding structures, or increasing seedling output."
        )
      }
    }),
    [t]
  );
};

const ManagerType: FC<{ nursery: NurseryFullDto }> = ({ nursery }) => {
  const t = useT();
  const nurseryTypeMap = useNurseryTypeMap();
  const typeConfig = nursery.type != null ? nurseryTypeMap[nursery.type] : null;

  return (
    <Box
      width="15rem"
      minWidth="15rem"
      height="auto"
      className="flex flex-col gap-2 pt-5 mobile:!w-full"
      css={{ "&": { alignItems: "self-end !important" } }}
    >
      <Flex width="fit-content" flexDirection="column" justifyContent="center" gap={2} className="mobile:w-full">
        <Text color="primary.900" textStyle="300-bold">
          {t("Management Type:")}
        </Text>
        <Flex className="w-36 flex-col mobile:w-fit" alignItems="center" gap={2}>
          {typeConfig != null ? (
            <>
              {typeConfig.icon}
              <Text textStyle="400-bold" color="secondary.800" className="text-center leading-5">
                {typeConfig.label}{" "}
                <Tooltip
                  content={
                    <>
                      <Text as="span" textStyle="200-bold">
                        {typeConfig.label}:{" "}
                      </Text>
                      {typeConfig.tooltip}
                    </>
                  }
                >
                  <InfoIcon className="text-theme-neutral-800 h-3 w-3" />
                </Tooltip>
              </Text>
            </>
          ) : (
            <Text textStyle="400-bold" color="neutral.600" className="text-center leading-5">
              {t("N/A")}
            </Text>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default ManagerType;
