import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import { useOrganisationInviteReminder } from "@/connections/UserAssociation";
import { useRequestSuccess } from "@/hooks/useConnectionUpdate";
import ActionCell from "@/redesignComponents/dataDisplay/Table/components/ActionCell";
import { RefreshIcon } from "@/redesignComponents/foundations/Icons";
import { showToast } from "@/redesignComponents/status/Toast/showToast";

type InviteReminderCellProps = {
  organisationUuid: string;
  userUuid: string;
};

const InviteReminderCell: FC<InviteReminderCellProps> = ({ organisationUuid, userUuid }) => {
  const t = useT();
  const [, { sendReminder, isSending, sendFailure }] = useOrganisationInviteReminder({ organisationUuid, userUuid });

  useRequestSuccess(
    isSending,
    sendFailure,
    useCallback(
      () =>
        showToast({
          label: t("Reminder sent successfully"),
          type: "success",
          placement: "bottom",
          duration: 5000
        }),
      [t]
    ),
    "Unable to send the reminder. Please try again."
  );

  return (
    <ActionCell
      buttonSecondary={{
        children: t("Send Reminder"),
        leftIcon: <RefreshIcon boxSize={3} />,
        size: "small",
        variant: "secondary",
        disabled: isSending,
        onClick: sendReminder
      }}
    />
  );
};

export default InviteReminderCell;
