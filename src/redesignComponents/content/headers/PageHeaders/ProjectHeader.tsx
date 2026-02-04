import { Box, Flex } from "@chakra-ui/react";
import { FC } from "react";

import { ProgressTagProps } from "@/redesignComponents/actions/Tags/ProgressTag/ProgressTag";

import ProfileImage, { ProfileImageProps } from "../../Images/ProfileImage/ProfileImage";
import ProjectInfo from "./components/ProjectInfo";
import TeamSection, { TeamMember } from "./components/TeamSection";

export interface ProjectHeaderProps {
  title: string;
  image?: ProfileImageProps;
  tag: ProgressTagProps;
  organization: string;
  description?: string;
  startDate: string;
  endDate: string;
  countryFlag: string;
  country: string;
  team?: TeamMember[];
}

const IMAGE_SIZE = 164;
const IMAGE_CONTAINER_CLASSES = "!min-w-40 !min-h-40 !h-44 !w-44";

const ProjectHeader: FC<ProjectHeaderProps> = ({
  title,
  image,
  tag,
  organization,
  description,
  startDate,
  endDate,
  countryFlag,
  country,
  team
}) => {
  return (
    <Box
      display="flex"
      items-center
      gap={4}
      paddingX={5}
      paddingY={4}
      justifyContent="space-between"
      background="secondary.neutral"
    >
      <Flex gap={5}>
        <div className={IMAGE_CONTAINER_CLASSES}>
          <ProfileImage size={IMAGE_SIZE} {...image} />
        </div>
        <ProjectInfo
          title={title}
          tag={tag}
          organization={organization}
          country={country}
          startDate={startDate}
          endDate={endDate}
          description={description}
          countryFlag={countryFlag}
        />
      </Flex>
      <TeamSection team={team} />
    </Box>
  );
};

export default ProjectHeader;
