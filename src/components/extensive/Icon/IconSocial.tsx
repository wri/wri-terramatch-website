import Link from "next/link";
import { FC } from "react";

import Icon, { IconNames } from "./Icon";

type IconSocialProps = {
  name:
    | IconNames.SOCIAL_FACEBOOK
    | IconNames.SOCIAL_INSTAGRAM
    | IconNames.SOCIAL_LINKEDIN
    | IconNames.SOCIAL_TWITTER
    | IconNames.EARTH;
  url?: string;
  className?: string;
};

const IconSocial: FC<IconSocialProps> = ({ name, url, className }) =>
  url == null ? null : (
    <Link href={url ?? ""} rel="noopener noreferrer" target="_blank">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white bg-[#002633]">
        <Icon name={name} width={17} className={`${className} fill-white`} />
      </div>
    </Link>
  );

export default IconSocial;
