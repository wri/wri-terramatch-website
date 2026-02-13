import { Box, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { FC } from "react";
import Twemoji from "react-twemoji";

import { useMyOrg } from "@/connections/Organisation";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetEditEntityHandler } from "@/hooks/entity/useGetEditEntityHandler";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ProgressTag, ProgressTagProps } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";
import { ChevronRight } from "@/redesignComponents/foundations/Icons";

import DateRange from "./DateRange";
import ProjectDescription from "./ProjectDescription";
import SeparatorDot from "./SeparatorDot";

export interface ProjectInfoProps {
  title: string;
  tag: ProgressTagProps;
  organization: string;
  country: string;
  countryFlag: string;
  startDate: string;
  endDate: string;
  description?: string;
  project: ProjectFullDto;
}

const ProjectInfo: FC<ProjectInfoProps> = ({
  title,
  tag,
  organization,
  country,
  countryFlag,
  startDate,
  endDate,
  description,
  project
}) => {
  const t = useT();
  const { handleEdit } = useGetEditEntityHandler({
    entityName: "projects",
    entityUUID: project.uuid,
    entityStatus: project.status ?? "started",
    updateRequestStatus: project.updateRequestStatus ?? "no-update"
  });
  const [, myOrg] = useMyOrg();
  const router = useRouter();
  return (
    <Box gap={2} className="flex flex-col">
      <Text
        fontSize="28px"
        lineHeight="36px"
        color="primary.900"
        fontWeight="bold"
        className="flex items-baseline gap-3"
      >
        {title} <ProgressTag {...tag} />
      </Text>
      <Text fontSize="16px" lineHeight="24px" color="neutral.900" className="-ml-[8px] flex items-center gap-2">
        <Button
          variant="borderless"
          size="small"
          className="-mr-2"
          onClick={() => router.push(myOrg?.organisationId ? `/organization/${myOrg?.organisationId}` : "/")}
        >
          {organization}
        </Button>
        <SeparatorDot />
        <Twemoji options={{ className: "h-4 w-4" }}>{countryFlag}</Twemoji>
        <Text fontSize="14px" lineHeight="24px" color="primary.900">
          {country}
        </Text>
      </Text>
      <DateRange startDate={startDate} endDate={endDate} />
      {description != null ? (
        <ProjectDescription description={description} />
      ) : (
        <div className="w-fit">
          <Button onClick={handleEdit} variant="secondary" size="small" rightIcon={<ChevronRight />} className="w-auto">
            {t("Add Project Information")}
          </Button>
        </div>
      )}
    </Box>
  );
};

export default ProjectInfo;
