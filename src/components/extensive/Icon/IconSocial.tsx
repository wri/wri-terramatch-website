import Link from "next/link";
import { When } from "react-if";

import Icon, { IconNames } from "./Icon";

export type IconSocialProps = {
  name:
    | IconNames.SOCIAL_FACEBOOK
    | IconNames.SOCIAL_INSTAGRAM
    | IconNames.SOCIAL_LINKEDIN
    | IconNames.SOCIAL_TWITTER
    | IconNames.EARTH;
  url?: string;
};

const IconSocial = ({ name, url }: IconSocialProps) => {
  return (
    <When condition={url}>
      <Link href={url ?? ""} rel="noopener noreferrer" target="_blank">
        <Icon name={name} className=" h-8 w-8" />
      </Link>
    </When>
  );
};

export default IconSocial;
