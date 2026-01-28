import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
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
}

interface ProfileListCardComponentProps {
  items: IProfileListCardProps[];
}

const ProfileSection: FC<IProfileListCardProps> = ({ title, profiles, onProfileClick }) => {
  const t = useT();

  return (
    <Box>
      {/* Title Section */}
      <Box>
        <Text fontSize="18px" lineHeight="28px" color="neutral.900" fontWeight="semibold">
          {t(title)}
        </Text>
      </Box>

      <SimpleDivider marginY={2} />

      {/* Profiles List */}
      <Flex direction="column" gap={1} marginTop={3}>
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
            <Flex alignItems="center" gap={2} tabIndex={0}>
              <Avatar variant="add" ariaLabel={t("No profiles found")} name={t("No profiles found")} />
              <Button
                variant="borderless"
                size="small"
                className="!px-0 hover:!px-2.5"
                rightIcon={<ChevronRight boxSize={3} color="neutral.800" />}
              >
                {t("Invite Team Member")}
              </Button>
            </Flex>
          </>
        )}
      </Flex>
    </Box>
  );
};

const ProfileListCard: FC<ProfileListCardComponentProps> = ({ items }) => {
  return (
    <Box
      className="w-[403px]"
      paddingX={5}
      paddingY={4}
      backgroundColor="white"
      borderRadius="4px"
      gap={6}
      display="flex"
      flexDirection="column"
    >
      {items.map((item, itemIndex) => (
        <ProfileSection key={itemIndex} {...item} />
      ))}
    </Box>
  );
};

export default ProfileListCard;
