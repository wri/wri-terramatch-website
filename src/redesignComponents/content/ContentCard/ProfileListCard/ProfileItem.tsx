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

  const canMessage = profile.isProjectManager && !!profile.email;

  const handleClick = useCallback(() => {
    onProfileClick(profile);
    if (canMessage && profile.email) {
      const mailtoUrl = `mailto:${profile.email}?cc=info@terramatch.org`;
      window.location.href = mailtoUrl;
    }
  }, [canMessage, onProfileClick, profile]);

  return (
    <>
      <Avatar name={profile.name} src={profile.image} ariaLabel={profile.name} />
      <Text flex={1} textStyle="400" color="neutral.900">
        {profile.name}
      </Text>
      <Button
        variant="borderless"
        size="small"
        onClick={handleClick}
        leftIcon={<Messages boxSize={3} color="neutral.800" />}
        className={canMessage ? undefined : "hidden"}
      >
        {t("Message")}
      </Button>
    </>
  );
};

export default ProfileItem;
