import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC } from "react";

import { NurseryFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { EditIcon } from "@/redesignComponents/foundations/Icons";

import DateRange from "./DateRange";
import ProjectDescription from "./ProjectDescription";
import SeparatorDot from "./SeparatorDot";

export interface NurseryInfoProps {
  nursery: NurseryFullDto;
  organization: string;
  projectName: string;
  projectUuid: string;
  startDate: string;
  endDate: string;
  description?: string;
}

const NurseryInfo: FC<NurseryInfoProps> = ({
  nursery,
  organization,
  projectName,
  projectUuid,
  startDate,
  endDate,
  description
}) => {
  const t = useT();
  const router = useRouter();

  const { handleEdit } = useGetEditEntityHandler({
    entityName: "nurseries",
    entityUUID: nursery.uuid,
    entityStatus: nursery.status ?? "started",
    updateRequestStatus: nursery.updateRequestStatus ?? "no-update"
  });

  return (
    <Box gap={2} className="flex flex-col">
      <Text textStyle="400" color="neutral.900" className="-ml-[8px] flex items-center gap-2">
        <Button
          variant="borderless"
          size="small"
          className="-mr-2"
          onClick={() => router.push(`/project/${projectUuid}`)}
        >
          {projectName}
        </Button>
        <SeparatorDot />
        <Button variant="borderless" size="small" className="-mr-2" onClick={() => router.push(`/my-projects`)}>
          {organization}
        </Button>
      </Text>
      <DateRange startDate={startDate} endDate={endDate} />
      {description != null ? (
        <ProjectDescription description={description} handleEdit={handleEdit} backgroundColor="neutral.100" />
      ) : (
        <div className="w-fit">
          <Button variant="secondary" size="small" leftIcon={<EditIcon />} className="w-auto" onClick={handleEdit}>
            {t("Edit")}
          </Button>
        </div>
      )}
    </Box>
  );
};

export default NurseryInfo;
