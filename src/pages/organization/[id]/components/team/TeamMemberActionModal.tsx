import { Box, Flex, List, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";

export type TeamMemberAction = "approve" | "reject" | "remove";

export type TeamBulkMember = {
  id: string;
  fullName: string;
  associationStatus: "requested" | "approved";
};

type TeamMemberActionModalProps = {
  action: TeamMemberAction | null;
  members: TeamBulkMember[];
  onClose: () => void;
  onConfirm: () => void;
};

const TeamMemberActionModal: FC<TeamMemberActionModalProps> = ({ action, members, onClose, onConfirm }) => {
  const t = useT();
  const isMultiple = members.length > 1;

  const getTitle = useCallback(() => {
    if (action === "approve") return isMultiple ? t("Approve Access Requests?") : t("Approve Access Request?");
    if (action === "reject") return isMultiple ? t("Reject Access Requests?") : t("Reject Access Request?");
    return isMultiple ? t("Remove Team Members?") : t("Remove Team Member?");
  }, [action, isMultiple, t]);

  const getDescription = useCallback(() => {
    if (action === "approve") {
      return t("Are you sure you want to approve the requests from the following users to join the Organization?");
    }
    if (action === "reject") {
      return t("Are you sure you want to reject the requests from the following users to join the Organization?");
    }
    return t("Are you sure you want to remove the following team members from the Organization?");
  }, [action, t]);

  const actionLabel = action === "approve" ? t("Approve") : action === "reject" ? t("Reject") : t("Remove");
  const isNegativeAction = action === "reject" || action === "remove";
  const listBackground = action === "approve" ? "primary.100" : "neutral.200";
  const firstMember = members[0];

  return (
    <Modal
      open={action != null}
      onClose={onClose}
      size={isMultiple && action === "approve" ? "large" : isMultiple ? "medium" : "small"}
      header={
        <Text textStyle="400-bold" color="neutral.800">
          {getTitle()}
        </Text>
      }
      content={
        isMultiple ? (
          <Box width="100%">
            <Text textStyle="400" color="neutral.900" mb={3}>
              {getDescription()}
            </Text>
            <Box background={listBackground} borderRadius="0.25rem" px={2} py={3}>
              <List.Root as="ul" pl={4} spaceY={2} listStyleType="disc">
                {members.map(member => (
                  <List.Item key={member.id}>
                    <Text as="span" textStyle="400" color="neutral.900">
                      {member.fullName}
                    </Text>
                  </List.Item>
                ))}
              </List.Root>
            </Box>
          </Box>
        ) : (
          <Flex alignItems="center" flexDirection="column" width="100%" textAlign="center">
            <Text textStyle="400" color="neutral.900">
              {action === "remove"
                ? t("Are you sure you want to remove")
                : action === "reject"
                ? t("Are you sure you want to reject")
                : t("Are you sure you want to approve")}
            </Text>
            <Text textStyle="500-bold" color="neutral.900">
              {action === "remove" ? firstMember?.fullName : `${firstMember?.fullName}'s`}
            </Text>
            <Text textStyle="400" color="neutral.900">
              {action === "remove" ? t("from the Organization?") : t("request to join the Organization?")}
            </Text>
          </Flex>
        )
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "cancel",
              variant: "secondary",
              children: t("Cancel"),
              onClick: onClose
            },
            {
              id: "confirm",
              variant: isNegativeAction ? "negative" : "primary",
              children: actionLabel,
              onClick: onConfirm
            }
          ]}
        />
      }
    />
  );
};

export default TeamMemberActionModal;
