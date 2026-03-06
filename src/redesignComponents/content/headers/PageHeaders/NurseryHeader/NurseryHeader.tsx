import { Box, Flex } from "@chakra-ui/react";
import { FC } from "react";

import { NurseryFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { formatMonthYear } from "@/redesignComponents/content/headers/PageHeaders/ProjectHeader/projectHeader.utils";

import ManagerType from "../components/ManagerType";
import NurseryInfo from "../components/NurseryInfo";

export interface NurseryHeaderProps {
  nursery: NurseryFullDto;
}

const NurseryHeader: FC<NurseryHeaderProps> = ({ nursery }) => {
  return (
    <Box display="flex" gap={4} px={6} py={5} justifyContent="space-between">
      <Flex gap={5}>
        <NurseryInfo
          nursery={nursery}
          title={nursery.name ?? "-"}
          organization={nursery.organisationName ?? "-"}
          projectName={nursery.projectName ?? "-"}
          projectUuid={nursery.projectUuid ?? ""}
          startDate={formatMonthYear(nursery.startDate)}
          endDate={formatMonthYear(nursery.endDate)}
        />
      </Flex>
      <ManagerType nursery={nursery} />
    </Box>
  );
};

export default NurseryHeader;
