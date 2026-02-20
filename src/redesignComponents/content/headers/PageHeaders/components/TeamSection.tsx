import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { ChevronRight } from "@/redesignComponents/foundations/Icons";
import { TerraFundAFR100 } from "@/redesignComponents/foundations/Logos/TerraFundAFR100";
import Avatar, { AvatarProps } from "@/redesignComponents/navigation/Avatar/Avatar";

export interface TeamMember {
  name: string;
  avatar: AvatarProps;
}

export interface TeamSectionProps {
  team?: TeamMember[];
  onAddTeamClick: () => void;
  gotoTeamMembers: () => void;
}

const TeamSection: FC<TeamSectionProps> = ({ team, onAddTeamClick, gotoTeamMembers }) => {
  const t = useT();

  return (
    <Box
      width="240px"
      minWidth="240px"
      height="auto"
      className="flex flex-col gap-2 pt-11"
      css={{
        "&": {
          alignItems: "self-end !important"
        }
      }}
    >
      <div className="flex w-fit flex-col gap-2" onClick={gotoTeamMembers} role="button" tabIndex={0}>
        <Text color="primary.900" fontSize="14px" lineHeight="20px" fontWeight="bold">
          {t("Team:")}
        </Text>
        <Flex className="flex-wrap">
          {team != null && team.length > 0 ? (
            team.map(member => (
              <Box key={member.name} className="h-10 w-7">
                <Box className="absolute">
                  <Avatar {...member.avatar} />
                </Box>
              </Box>
            ))
          ) : (
            <Flex
              alignItems="center"
              tabIndex={0}
              className="group cursor-pointer"
              role="button"
              onClick={onAddTeamClick}
              css={{
                "&:hover .avatar-add": {
                  opacity: "0.8",
                  transform: "scale(1) !important"
                },
                "& .avatar-add": {
                  transform: "scale(1) !important"
                }
              }}
            >
              <Avatar variant="add" ariaLabel={t("No profiles found")} name={t("No profiles found")} />
              <Text
                fontSize="12px"
                lineHeight="16px"
                fontWeight="700"
                padding="6px 8px"
                borderRadius="4px"
                backgroundColor="transparent"
                color="secondary.900"
                width="auto"
                className="flex items-center gap-1 group-hover:bg-theme-primary-500/20"
              >
                {t("Add Team Members")}
                <ChevronRight color="neutral.800" className="h-2.5 w-2.5" />
              </Text>
            </Flex>
          )}
        </Flex>
      </div>

      <TerraFundAFR100 className="mt-auto" />
    </Box>
  );
};

export default TeamSection;
