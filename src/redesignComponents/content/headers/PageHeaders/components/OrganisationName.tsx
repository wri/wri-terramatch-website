import { FC } from "react";

import { useIsMyOrganisation } from "@/connections/Organisation";
import Button from "@/redesignComponents/actions/Buttons/Button/Button";

export interface OrganisationNameProps {
  organisationUuid?: string | null;
  name: string;
  className?: string;
  onClick: () => void;
}

const OrganisationName: FC<OrganisationNameProps> = ({ organisationUuid, name, className, onClick }) => {
  const isMyOrganisation = useIsMyOrganisation(organisationUuid);

  return (
    <Button variant="borderless" size="small" className={className} onClick={isMyOrganisation ? onClick : undefined}>
      {name}
    </Button>
  );
};

export default OrganisationName;
