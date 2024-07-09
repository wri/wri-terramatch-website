import { useT } from "@transifex/react";
import classNames from "classnames";
import Image from "next/image";
import AvatarPlaceholder from "public/images/avatar-placeholder.svg";
import { DetailedHTMLProps, FC, HTMLAttributes } from "react";

import { useDeletePartner } from "@/admin/hooks/usePartnerDeletion";
import Menu from "@/components/elements/Menu/Menu";
import Notification from "@/components/elements/Notification/Notification";
import StatusPill from "@/components/elements/StatusPill/StatusPill";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { useModalContext } from "@/context/modal.provider";

import { MENU_PLACEMENT_RIGHT_TOP } from "../../Menu/MenuVariant";

export interface UserProfileCardProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  imageUrl?: string;
  status: string;
  username: string;
  organisation: string;
  email: string;
  project: any;
  refetch: () => void;
}

const UserProfileCard: FC<UserProfileCardProps> = ({
  imageUrl = AvatarPlaceholder,
  status,
  username,
  organisation,
  email,
  className,
  project,
  refetch,
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
  const { openModal, closeModal } = useModalContext();
  const { notificationStatus, deletePartner } = useDeletePartner(project, refetch);

  const ModalConfirmDeletePartner = (email_address: string) => {
    openModal(
      <Modal
        iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
        title={""}
        content={t("Remove {email_address} as Monitoring Partner to {project_name}?", {
          email_address,
          project_name: project?.name
        })}
        primaryButtonProps={{
          children: t("Confirm"),
          onClick: () => {
            deletePartner(email_address as string);
            closeModal();
          }
        }}
        secondaryButtonProps={{
          children: t("Cancel"),
          onClick: closeModal
        }}
      />
    );
  };

  const tableMenu = [
    {
      id: "1",
      render: () => (
        <Text variant="text-14-bold" onClick={() => ModalConfirmDeletePartner(email)}>
          Remove Partner
        </Text>
      )
    }
  ];
  return (
    <>
      <div {...rest} className={classNames("rounded-xl border border-neutral-200 pb-4", className)}>
        <div className="relative flex aspect-square w-full items-center justify-center">
          <Image src={imageUrl} alt={username} fill className="object-contain object-top" />
          <div className="absolute top-3 right-3">
            <Menu menu={tableMenu} placement={MENU_PLACEMENT_RIGHT_TOP} classNameContentMenu="p-1">
              <Icon name={IconNames.ELIPSES} className="h-6 w-6 rounded-full p-1 hover:bg-neutral-200"></Icon>
            </Menu>
          </div>
        </div>

        <div className="mt-4 space-y-2 px-3">
          {statusProps && (
            <StatusPill status={statusProps.status} className="my-4 mt-4 w-fit">
              <Text variant="text-12-semibold" className="">
                {statusProps.text}
              </Text>
            </StatusPill>
          )}
          <Text variant="text-14-bold">{username}</Text>
          <Text variant="text-14-light">{organisation}</Text>
          <Text variant="text-14-light" className="one-line-text" title={email}>
            {email}
          </Text>
        </div>
      </div>
      <Notification {...notificationStatus} />
    </>
  );
};

export default UserProfileCard;
