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
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white bg-[#002633]">
          <Icon name={name} width={17} className=" fill-white" />
        </div>
      </Link>
    </When>
  );
};

export default IconSocial;
