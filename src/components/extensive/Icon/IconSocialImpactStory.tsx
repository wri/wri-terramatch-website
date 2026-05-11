import classNames from "classnames";
import Link from "next/link";
import { FC } from "react";

import Icon, { IconNames } from "./Icon";

type IconSocialImpactStoryProps = {
  name: IconNames.FACEBOOK | IconNames.INSTAGRAM | IconNames.LINKEDIN | IconNames.TWITTER;

  url?: string;
  className?: string;
};

const IconSocialImpactStory: FC<IconSocialImpactStoryProps> = ({ name, url, className }) =>
  url == null ? null : (
    <Link href={url} rel="noopener noreferrer" target="_blank">
      <Icon name={name} className={classNames("h-6 w-6 text-primary hover:scale-125", className)} />
    </Link>
  );

export default IconSocialImpactStory;
