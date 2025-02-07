import classNames from "classnames";
import Link from "next/link";
import { When } from "react-if";

import Icon, { IconNames } from "./Icon";

export type IconSocialImpactStoryProps = {
  name: IconNames.FACEBOOK | IconNames.INSTAGRAM | IconNames.LINKEDIN | IconNames.TWITTER;

  url?: string;
  className?: string;
};

const IconSocialImpactStory = ({ name, url, className }: IconSocialImpactStoryProps) => {
  return (
    <When condition={url}>
      <Link href={url ?? ""} rel="noopener noreferrer" target="_blank">
        <Icon name={name} className={classNames("h-6 w-6 text-primary hover:scale-125", className)} />
      </Link>
    </When>
  );
};

export default IconSocialImpactStory;
