import { useT } from "@transifex/react";
import classNames from "classnames";
import Image from "next/image";
import AvatarPlaceholder from "public/images/avatar-placeholder.svg";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Text from "@/components/elements/Text/Text";

export interface UserProfileCardProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  imageUrl?: string;
  status: string;
  username: string;
  organisation: string;
  email: string;
}

const UserProfileCard: FC<UserProfileCardProps> = ({
  imageUrl = AvatarPlaceholder,
  status,
  username,
  organisation,
  email,
  className,
  ...rest
}) => {
  const t = useT();
  const statusMapping: any = {
    Accepted: null,
    Pending: {
      status: "awaiting",
      text: t("Invite Sent")
    }
  };

  const statusProps = statusMapping[status];

  return (
    <div {...rest} className={classNames("rounded-xl border border-neutral-200 pb-4", className)}>
      <div className="relative flex aspect-square w-full items-center justify-center">
        <Image src={imageUrl} alt={username} fill className="object-contain object-top" />
      </div>

      <div className="mt-4 space-y-2 px-3">
        {statusProps && (
          <StatusPill status={statusProps.status} className="my-4 mt-4 w-fit">
            <Text variant="text-12-semibold" className="pt-0.5">
              {statusProps.text}
            </Text>
          </StatusPill>
        )}
        <Text variant="text-14-bold">{username}</Text>
        <Text variant="text-14-light">{organisation}</Text>
        <Text variant="text-14-light" className="truncate line-clamp-1" title={email}>
          {email}
        </Text>
      </div>
    </div>
  );
};

export default UserProfileCard;
