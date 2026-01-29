import { Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import { Messages } from "@/redesignComponents/foundations/Icons";
import Avatar from "@/redesignComponents/navigation/Avatar/Avatar";

import { IProfile } from "./ProfileListCard";

interface ProfileProps {
  profile: IProfile;
  onProfileClick: (profile: IProfile) => void;
}

const ProfileItem: FC<ProfileProps> = ({ profile, onProfileClick }) => {
  const t = useT();

  const handleClick = useCallback(() => {
    onProfileClick(profile);
  }, [onProfileClick, profile]);

  return (
    <>
      <Avatar name={profile.name} src={profile.image} ariaLabel={profile.name} />
      <Text flex={1} fontSize="16px" lineHeight="24px" color="neutral.900" fontWeight="regular">
        {profile.name}
      </Text>
      <Button
        variant="borderless"
        size="small"
        onClick={handleClick}
        className="!px-0 hover:!px-2.5"
        leftIcon={<Messages boxSize={3} color="neutral.800" />}
      >
        {t("Message")}
      </Button>
    </>
  );
};

export default ProfileItem;
