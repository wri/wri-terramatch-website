import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import { TranslatedText } from "@/i18n/types";
import { ChevronRightIcon } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import Avatar from "@/redesignComponents/navigation/Avatar/Avatar";

import ProfileItem from "./ProfileItem";

export interface IProfile {
  id: string;
  name: string;
  image?: string;
  email?: string;
  isProjectManager?: boolean;
  messageText?: string;
}

export interface IProfileListCardProps {
  title: TranslatedText;
  profiles?: IProfile[];
  onProfileClick: (profile: IProfile) => void;
  onInviteClick?: () => void;
  type?: string;
}

interface ProfileListCardComponentProps {
  items: IProfileListCardProps[];
  onInviteClick: () => void;
  type?: string;
}

const ProfileSection: FC<IProfileListCardProps> = ({ title, profiles, onProfileClick, onInviteClick, type }) => {
  const t = useT();

  return (
    <Flex direction="column" minHeight={0}>
      <Box>
        <Text textStyle="500" color="neutral.900" fontWeight="semibold">
          {title}
        </Text>
      </Box>

      <SimpleDivider marginY={2} />

      <Flex direction="column" gap={1} marginTop={3} minHeight={0} overflowY="auto">
        {profiles != null && profiles.length > 0 ? (
          <>
            {profiles.map(profile => (
              <ProfileItem key={profile.id} profile={profile} onProfileClick={onProfileClick} />
            ))}
          </>
        ) : (
          <>
            {type === "monitoring-partner" && (
              <Flex
                alignItems="center"
                gap={2}
                tabIndex={0}
                className="group cursor-pointer"
                role="button"
                onClick={() => onInviteClick?.()}
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
                  className="flex items-center gap-1 px-2 py-1.5 group-hover:bg-theme-primary-500/20"
                >
                  {t("Invite Team Member")}
                  <ChevronRightIcon color="neutral.800" className="h-2.5 w-2.5" />
                </Text>
              </Flex>
            )}
          </>
        )}
      </Flex>
    </Flex>
  );
};

const ProfileListCard: FC<ProfileListCardComponentProps> = ({ items, onInviteClick, type }) => {
  return (
    <Box
      paddingX={5}
      paddingY={4}
      backgroundColor="white"
      borderRadius="0.25rem"
      gap={6}
      display="flex"
      flexDirection="column"
      minHeight={0}
    >
      {items.map((item, itemIndex) => (
        <ProfileSection key={itemIndex} {...item} onInviteClick={onInviteClick} type={type} />
      ))}
    </Box>
  );
};

export default ProfileListCard;
