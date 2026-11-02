import { useT } from "@transifex/react";
import { FC, useCallback, useRef } from "react";

import { useOrganisationInviteReminder } from "@/connections/UserAssociation";
import { useRequestComplete } from "@/hooks/useConnectionUpdate";
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
  // The bulk toolbar sends through this same request URL, so this cell also sees those requests complete. Only report
  // the requests this cell started, so the toolbar's toast is the single confirmation for a bulk send.
  const sentFromCell = useRef(false);

  useRequestComplete(
    isSending,
    sendFailure,
    useCallback(
      failure => {
        if (!sentFromCell.current) return;
        sentFromCell.current = false;

        showToast(
          failure == null
            ? { label: t("Reminder sent successfully"), type: "success", placement: "bottom", duration: 5000 }
            : {
                label: t("Unable to send the reminder. Please try again."),
                type: "error",
                placement: "bottom",
                duration: 5000
              }
        );
      },
      [t]
    )
  );

  const handleSendReminder = () => {
    sentFromCell.current = true;
    sendReminder();
  };

  return (
    <ActionCell
      buttonSecondary={{
        children: t("Send Reminder"),
        leftIcon: <RefreshIcon boxSize={3} />,
        size: "small",
        variant: "secondary",
        disabled: isSending,
        onClick: handleSendReminder
      }}
    />
  );
};

export default InviteReminderCell;
