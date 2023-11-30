import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { V2GenericList } from "@/generated/apiSchemas";

import { useOrganizationCreateContext } from "../context/OrganizationCreate.provider";

type OrganizationSelectRowProps = {
  organization: V2GenericList;
};

const OrganizationSelectRow = ({ organization }: OrganizationSelectRowProps) => {
  const { setSelectedOrganization, form } = useOrganizationCreateContext();

  const handleSelect = () => {
    form.setValue("name", organization.name ?? "");
    setSelectedOrganization(organization);
  };

  return (
    <div className="flex items-center justify-between border-b-2 border-neutral-100 py-6 ">
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success">
          <Icon name={IconNames.TREE} width={20} className="fill-white" />
        </div>
        <Text variant="text-body-600">{organization.name}</Text>
      </div>
      <Button type="button" onClick={handleSelect}>
        Select
      </Button>
    </div>
  );
};

export default OrganizationSelectRow;
