import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { ReactNode } from "react";

import { NurseryFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { NurseryBuildingIcon, NurseryExpandingIcon, NurseryManagingIcon } from "@/redesignComponents/foundations/Icons";

type NurseryTypeConfig = { icon: ReactNode; label: string };

const NURSERY_TYPE_MAP: Record<string, NurseryTypeConfig> = {
  expanding: {
    icon: <NurseryExpandingIcon className="text-theme-secondary-800 h-8 w-8" />,
    label: "Nursery Expansion"
  },
  building: { icon: <NurseryBuildingIcon className="text-theme-secondary-800 h-8 w-8" />, label: "New Nursery" },
  managing: { icon: <NurseryManagingIcon className="text-theme-secondary-800 h-8 w-8" />, label: "Co-managed Nursery" }
};

const ManagerType = ({ nursery }: { nursery: NurseryFullDto }) => {
  const t = useT();
  const typeConfig = nursery.type ? NURSERY_TYPE_MAP[nursery.type] : null;

  return (
    <Box
      width="240px"
      minWidth="240px"
      height="auto"
      className="flex flex-col gap-2 pt-5"
      css={{ "&": { alignItems: "self-end !important" } }}
    >
      <div className="flex w-fit flex-col justify-center gap-2">
        <Text color="primary.900" textStyle="300-bold">
          {t("Management Type:")}
        </Text>
        <Flex className="w-36 flex-col" alignItems="center" gap={2}>
          {typeConfig && typeConfig.icon ? (
            <>
              {typeConfig.icon}
              <Text textStyle="400-bold" color="secondary.800" className="text-center leading-5">
                {t(typeConfig.label)}
              </Text>
            </>
          ) : (
            <Text textStyle="400-bold" color="neutral.600" className="text-center leading-5">
              N/A
            </Text>
          )}
        </Flex>
      </div>
    </Box>
  );
};

export default ManagerType;
