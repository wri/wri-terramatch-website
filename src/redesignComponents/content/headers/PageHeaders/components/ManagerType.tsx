import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { ReactNode, useMemo } from "react";

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
  return useMemo(() => {
    return {
      expanding: {
        icon: <NurseryExpandingIcon className="h-8 w-8 text-theme-secondary-800" />,
        label: t("Nursery Expansion"),
        tooltip: t(
          "An existing nursery that increases its production capacity for the project, such as by adding infrastructure, expanding structures, or increasing seedling output."
        )
      },
      building: {
        icon: <NurseryBuildingIcon className="h-8 w-8 text-theme-secondary-800" />,
        label: t("New Nursery"),
        tooltip: t(
          "A nursery that is newly established, including setting up infrastructure, sourcing materials, and starting seedling production."
        )
      },
      managing: {
        icon: <NurseryManagingIcon className="h-8 w-8 text-theme-secondary-800" />,
        label: t("Co-Managed Nursery"),
        tooltip: t(
          "A nursery jointly operated with a community or partner, where the organization might be supporting maintenance, production management, and quality control to build skills or economic opportunities or any other activity."
        )
      },
      "new-nursery": {
        icon: <NurseryBuildingIcon className="h-8 w-8 text-theme-secondary-800" />,
        label: t("New Nursery"),
        tooltip: t(
          "A nursery that is newly established, including setting up infrastructure, sourcing materials, and starting seedling production."
        )
      },
      "co-managed-nursery": {
        icon: <NurseryManagingIcon className="h-8 w-8 text-theme-secondary-800" />,
        label: t("Co-managed Nursery"),
        tooltip: t(
          "A nursery jointly operated with a community or partner, where the organization might be supporting maintenance, production management, and quality control to build skills or economic opportunities or any other activity."
        )
      },
      "nursery-expansion": {
        icon: <NurseryExpandingIcon className="h-8 w-8 text-theme-secondary-800" />,
        label: t("Nursery Expansion"),
        tooltip: t(
          "An existing nursery that increases its production capacity for the project, such as by adding infrastructure, expanding structures, or increasing seedling output."
        )
      }
    };
  }, [t]);
};

const ManagerType = ({ nursery }: { nursery: NurseryFullDto }) => {
  const t = useT();
  const nurseryTypeMap = useNurseryTypeMap();
  const typeConfig = nursery.type !== null ? nurseryTypeMap[nursery.type] : null;

  return (
    <Box
      width="15rem"
      minWidth="15rem"
      height="auto"
      className="flex flex-col gap-2 pt-5 mobile:!w-full"
      css={{ "&": { alignItems: "self-end !important" } }}
    >
      <div className="flex w-fit flex-col justify-center gap-2 mobile:w-full">
        <Text color="primary.900" textStyle="300-bold">
          {t("Management Type:")}
        </Text>
        <Flex className="w-36 flex-col mobile:w-fit" alignItems="center" gap={2}>
          {typeConfig !== null && typeConfig.icon !== null ? (
            <>
              {typeConfig.icon}
              <Text textStyle="400-bold" color="secondary.800" className="text-center leading-5">
                {typeConfig.label}{" "}
                <Tooltip
                  content={
                    <>
                      <span className="text-sm font-semibold">{typeConfig.label}: </span>
                      {typeConfig.tooltip}
                    </>
                  }
                >
                  <InfoIcon className="h-3 w-3 text-theme-neutral-800" />
                </Tooltip>
              </Text>
            </>
          ) : (
            <Text textStyle="400-bold" color="neutral.600" className="text-center leading-5">
              {t("N/A")}
            </Text>
          )}
        </Flex>
      </div>
    </Box>
  );
};

export default ManagerType;
