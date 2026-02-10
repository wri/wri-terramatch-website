import { Box, Flex } from "@chakra-ui/react";
import { FC, useMemo } from "react";

import { useGadmOptions } from "@/connections/Gadm";
import { GetV2ProjectsUUIDPartnersResponse, useGetV2ProjectsUUIDPartners } from "@/generated/apiComponents";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import {
  IMAGE_CONTAINER_CLASSES,
  IMAGE_SIZE
} from "@/redesignComponents/content/headers/PageHeaders/constants/projectHeader";
import {
  countryCodeToFlag,
  formatMonthYear,
  mapPlantingStatusToProgressState
} from "@/redesignComponents/content/headers/PageHeaders/utils/projectHeader";
import { formatOptionsList } from "@/utils/options";

import ProfileImage from "../../Images/ProfileImage/ProfileImage";
import ProjectInfo from "./components/ProjectInfo";
import TeamSection from "./components/TeamSection";

export interface ProjectHeaderProps {
  project: ProjectFullDto;
}

const ProjectHeader: FC<ProjectHeaderProps> = ({ project }) => {
  const { data: partners } = useGetV2ProjectsUUIDPartners<{ data: GetV2ProjectsUUIDPartnersResponse }>({
    pathParams: { uuid: project.uuid }
  });

  const teamMembers = useMemo(
    () =>
      (partners?.data ?? []).slice(0, 5).map(partner => {
        const name = `${partner.first_name ?? ""} ${partner.last_name ?? ""}`.trim();
        return { name, avatar: { name } };
      }),
    [partners?.data]
  );

  const countryOptions = useGadmOptions({ level: 0 });

  return (
    <Box display="flex" gap={4} px={6} py={5} justifyContent="space-between" background="secondary.neutral">
      <Flex gap={5}>
        <div className={IMAGE_CONTAINER_CLASSES}>
          <ProfileImage size={IMAGE_SIZE} alt={project.name ?? ""} />
        </div>

        <ProjectInfo
          project={project}
          title={project.name ?? "-"}
          tag={{ state: mapPlantingStatusToProgressState(project.plantingStatus) }}
          organization={project.organisationName ?? "-"}
          country={formatOptionsList(countryOptions ?? [], project.country ?? [])}
          startDate={formatMonthYear(project.plantingStartDate)}
          endDate={formatMonthYear(project.plantingEndDate)}
          description={project.description ?? undefined}
          countryFlag={countryCodeToFlag(project.country)}
        />
      </Flex>

      <TeamSection team={teamMembers} />
    </Box>
  );
};

export default ProjectHeader;
