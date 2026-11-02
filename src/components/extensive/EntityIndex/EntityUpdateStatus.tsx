import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { EditIcon } from "@/redesignComponents/foundations/Icons";
import { isAbsentChangeRequestStatus } from "@/utils/changeRequestStatusDisplay";

export type EntityUpdateStatusValue = "draft" | "pending-approval" | "information-required" | "approved";

type EntityUpdateStatusProps = {
  status: EntityUpdateStatusValue | null | undefined;
};

const EntityUpdateStatus: FC<EntityUpdateStatusProps> = ({ status }) => {
  const t = useT();

  if (status == null || isAbsentChangeRequestStatus(status)) {
    return (
      <Text textStyle="300" color="neutral.800">
        –
      </Text>
    );
  }

  const updateLabel = {
    draft: t("Draft"),
    "pending-approval": t("Pending Approval"),
    "information-required": t("Information Required"),
    approved: t("Complete")
  }[status];

  return (
    <Box className="flex items-center gap-1 text-theme-neutral-800">
      <EditIcon boxSize={2.5} />
      {status !== "approved" ? (
        <Text as="span" textStyle="200">
          {t("Editing:")}
        </Text>
      ) : null}
      <Text as="span" textStyle="200-bold">
        {updateLabel}
      </Text>
    </Box>
  );
};

export default EntityUpdateStatus;
