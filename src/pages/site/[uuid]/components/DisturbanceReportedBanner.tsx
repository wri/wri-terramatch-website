import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import type { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { InformationRequiredIcon } from "@/redesignComponents/foundations/Icons";

import { openDisturbanceReportInNewTab } from "./polygonTable.constants";

export type DisturbanceReportedBannerProps = {
  disturbanceReportUuid: string;
};

const DisturbanceReportedBanner: FC<DisturbanceReportedBannerProps> = ({ disturbanceReportUuid }) => {
  const t = useT();

  return (
    <Flex
      align="center"
      justify="space-between"
      gap={3}
      bg="error.100"
      borderWidth="0.0625rem"
      borderColor="error.300"
      className="rounded px-4 py-2"
    >
      <Flex className="items-center gap-2">
        <InformationRequiredIcon boxSize="1rem" color="error.500" />
        <Text textStyle="300-bold" color="error.900">
          {t("Disturbance Reported")}
        </Text>
      </Flex>
      <Button size="small" variant="secondary" onClick={() => openDisturbanceReportInNewTab(disturbanceReportUuid)}>
        {t("View Report")}
      </Button>
    </Flex>
  );
};

export default DisturbanceReportedBanner;
