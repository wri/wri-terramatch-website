import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { ChevronRight } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import Avatar from "@/redesignComponents/navigation/Avatar/Avatar";

import ProfileItem from "./ProfileItem";

export interface IProfile {
  id: string;
  name: string;
  image: string;
}

export interface IProfileListCardProps {
  title: string;
  profiles?: IProfile[];
  onProfileClick: (profile: IProfile) => void;
  onInviteClick?: () => void;
}

interface ProfileListCardComponentProps {
  items: IProfileListCardProps[];
}

const ProfileSection: FC<IProfileListCardProps> = ({ title, profiles, onProfileClick, onInviteClick }) => {
  const t = useT();

  return (
    <Flex direction="column" minHeight={0}>
      <Box>
        <Text fontSize="18px" lineHeight="28px" color="neutral.900" fontWeight="semibold">
          {t(title)}
        </Text>
      </Box>

      <SimpleDivider marginY={2} />

      <Flex direction="column" gap={1} marginTop={3} minHeight={0} overflowY="auto">
        {profiles != null && profiles.length > 0 ? (
          <>
            {profiles.map(profile => (
              <Flex key={profile.id} alignItems="center" gap={2} tabIndex={0}>
                <ProfileItem profile={profile} onProfileClick={onProfileClick} />
              </Flex>
            ))}
          </>
        ) : (
          <>
            <Flex
              alignItems="center"
              gap={2}
              tabIndex={0}
              className="group cursor-pointer"
              role="button"
              onClick={onInviteClick}
              css={{
                "&:hover .avatar-add": {
                  opacity: "0.8"
                }
              }}
            >
              <Avatar variant="add" ariaLabel={t("No profiles found")} name={t("No profiles found")} />
              <Text
                fontSize={"12px"}
                lineHeight={"16px"}
                fontWeight={"700"}
                padding={"6px 8px"}
                borderRadius={"4px"}
                backgroundColor={"transparent"}
                color={"secondary.900"}
                width={"auto"}
                className="flex items-center gap-1 group-hover:bg-theme-primary-500/20"
              >
                {t("Invite Team Member")}
                <ChevronRight color="neutral.800" className="h-2.5 w-2.5" />
              </Text>
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  );
};

const ProfileListCard: FC<ProfileListCardComponentProps> = ({ items }) => {
  return (
    <Box
      paddingX={5}
      paddingY={4}
      backgroundColor="white"
      borderRadius="4px"
      gap={6}
      display="flex"
      flexDirection="column"
      minHeight={0}
    >
      {items.map((item, itemIndex) => (
        <ProfileSection key={itemIndex} {...item} />
      ))}
    </Box>
  );
};

export default ProfileListCard;
