import { Box, Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { ChevronRight, Messages } from "@/redesignComponents/foundations/Icons";
import SimpleDivider from "@/redesignComponents/miscellaneous/Dividers/SimpleDivider";
import Avatar from "@/redesignComponents/navigation/Avatar/Avatar";

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

  const handleProfileClick = useCallback(
    (profile: IProfile) => {
      onProfileClick(profile);
    },
    [onProfileClick]
  );

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
        {profiles && profiles.length > 0 ? (
          <>
            {profiles.map(profile => (
              <Flex key={profile.id} alignItems="center" gap={2} tabIndex={0}>
                <Avatar name={profile.name} src={profile.image} ariaLabel={profile.name} />
                <Text flex={1} fontSize="16px" lineHeight="24px" color="neutral.900" fontWeight="regular">
                  {profile.name}
                </Text>
                <Button
                  variant="borderless"
                  size="small"
                  onClick={() => handleProfileClick(profile)}
                  className="!px-0 hover:!px-2.5"
                  leftIcon={<Messages boxSize={3} color="neutral.800" />}
                >
                  {t("Message")}
                </Button>
              </Flex>
            ))}
          </>
        ) : (
          <>
            <Flex alignItems="center" gap={2} tabIndex={0}>
              <Avatar variant="add" ariaLabel="No profiles found" name="No profiles found" />
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
