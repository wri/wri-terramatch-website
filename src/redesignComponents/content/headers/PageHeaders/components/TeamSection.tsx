import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import classNames from "classnames";
import { FC } from "react";

import { ContextCondition } from "@/context/ContextCondition";
import { Framework, TERRAFUND_AFR100_BANNER_LOGO_FRAMEWORKS } from "@/context/framework.provider";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";
import { PpcProgramBannerLogo } from "@/redesignComponents/foundations/Logos/PpcProgramBannerLogo";
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
      width="15rem"
      minWidth="15rem"
      height="auto"
      className="flex flex-col gap-2 pt-11 mobile:!w-full mobile:flex-row mobile:items-center mobile:justify-between mobile:pt-0"
      css={{
        "&": {
          alignItems: "self-end !important"
        }
      }}
    >
      <div className="flex w-fit flex-col gap-2" onClick={gotoTeamMembers} role="button" tabIndex={0}>
        <Text color="primary.900" textStyle="300-bold">
          {t("Team:")}
        </Text>
        <Flex className={classNames("flex-wrap", team != null && team.length > 0 ? "pr-3.5" : "")}>
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
                textStyle="200-bold"
                padding="0.375rem 0.5rem"
                borderRadius="0.25rem"
                backgroundColor="transparent"
                color="secondary.900"
                width="auto"
                className="group-hover:bg-theme-primary-500/20 flex items-center gap-1"
              >
                {t("Add Team Members")}
                <ChevronRightIcon color="neutral.800" className="h-2.5 w-2.5" />
              </Text>
            </Flex>
          )}
        </Flex>
      </div>

      {/* Logos read framework from FrameworkProvider (project page); no frameworkKey prop. */}
      <ContextCondition frameworksShow={TERRAFUND_AFR100_BANNER_LOGO_FRAMEWORKS}>
        <TerraFundAFR100 className="mt-auto" />
      </ContextCondition>
      <ContextCondition frameworksShow={[Framework.PPC]}>
        <PpcProgramBannerLogo className="mt-auto" />
      </ContextCondition>
    </Box>
  );
};

export default TeamSection;
