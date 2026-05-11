import { useT } from "@transifex/react";
import { FC } from "react";

import Button from "@/components/elements/Button/Button";
import Card from "@/components/elements/Cards/Generic/GenericCard";
import { UserAssociationDto } from "@/generated/v3/userService/userServiceSchemas";

export type TeamMemberCardProps = {
  type?: "pending" | "approved";
  user?: UserAssociationDto;
  onApprove?: (user?: UserAssociationDto) => void;
  onReject?: (user?: UserAssociationDto) => void;
};

const TeamMemberCard: FC<TeamMemberCardProps> = ({ user, type = "approved", onApprove, onReject }) => {
  const t = useT();

  return (
    <Card.Container>
      <Card.Image imageUrl="/images/pitch-placeholder.webp" />

      <Card.Body>
        <Card.Title className="line-clamp-1">{user?.fullName}</Card.Title>

        <Card.DataRow className="overflow-hidden text-ellipsis whitespace-nowrap">{`<strong> ${t(
          "Job Title:"
        )}</strong>${user?.jobRole}`}</Card.DataRow>
        <Card.DataRow className="overflow-hidden text-ellipsis whitespace-nowrap">{`<strong>${t(
          "Email:"
        )}</strong> ${user?.emailAddress?.trim()}`}</Card.DataRow>
        <Card.DataRow className="overflow-hidden text-ellipsis whitespace-nowrap">{`<strong>${t("Phone:")}</strong> ${
          user?.phoneNumber
        }`}</Card.DataRow>
      </Card.Body>

      {type === "pending" && (
        <Card.ActionContainer className="flex justify-between gap-3">
          <Button onClick={() => (onApprove != null ? onApprove(user) : null)} className="flex-1">
            {t("Approve")}
          </Button>

          <Button variant="secondary" onClick={() => (onReject != null ? onReject(user) : null)} className="flex-1">
            {t("Reject")}
          </Button>
        </Card.ActionContainer>
      )}
    </Card.Container>
  );
};

export default TeamMemberCard;
