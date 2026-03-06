import { Box, Flex } from "@chakra-ui/react";
import { FC, useMemo } from "react";

import { useGadmOptions } from "@/connections/Gadm";
import { useUserAssociations } from "@/connections/UserAssociation";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { getPlantingStatus } from "@/pages/project/[uuid]/tabs/constants/Detail.constants";
import {
  countryCodeToFlag,
  formatMonthYear
} from "@/redesignComponents/content/headers/PageHeaders/utils/projectHeader";
import { formatOptionsList } from "@/utils/options";

import ProjectInfo from "./components/ProjectInfo";
import TeamSection from "./components/TeamSection";

export interface ProjectHeaderProps {
  project: ProjectFullDto;
  onAddTeamClick: () => void;
  gotoTeamMembers: () => void;
}

const ProjectHeader: FC<ProjectHeaderProps> = ({ project, onAddTeamClick, gotoTeamMembers }) => {
  const [, { data: associatedUsers }] = useUserAssociations({
    uuid: project.uuid,
    filter: { isManager: false },
    model: "projects"
  });

  const teamMembers = useMemo(
    () =>
      (associatedUsers ?? []).slice(0, 5).map(user => {
        const name = `${user.fullName ?? ""}`.trim();
        return { name, avatar: { name } };
      }),
    [associatedUsers]
  );

  const countryOptions = useGadmOptions({ level: 0 });
  return (
    <Box display="flex" gap={4} px={6} py={5} justifyContent="space-between" background="secondary.neutral">
      <Flex gap={5}>
        {/* TODO: Add back in when we have a way to upload images */}

        {/* <div className={IMAGE_CONTAINER_CLASSES}>
          <ProfileImage size={IMAGE_SIZE} alt={project.name ?? ""} isAdd />
        </div> */}

        <ProjectInfo
          project={project}
          title={project.name ?? "-"}
          tag={{ state: getPlantingStatus(project?.plantingStatus!) }}
          organization={project.organisationName ?? "-"}
          country={formatOptionsList(countryOptions ?? [], project.country ?? [])}
          startDate={formatMonthYear(project.plantingStartDate)}
          endDate={formatMonthYear(project.plantingEndDate)}
          description={project.description ?? undefined}
          countryFlag={countryCodeToFlag(project.country)}
        />
      </Flex>

      <TeamSection
        team={teamMembers}
        onAddTeamClick={onAddTeamClick}
        gotoTeamMembers={gotoTeamMembers}
        project={project}
      />
    </Box>
  );
};

export default ProjectHeader;
