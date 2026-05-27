import { Stack } from "@mui/material";
import { FC, useCallback, useMemo } from "react";
import {
  Datagrid,
  FunctionField,
  ImageField,
  Link,
  SearchInput,
  SelectInput,
  TextField,
  useCreatePath
} from "react-admin";

import { AutoResetSort } from "@/admin/components/Actions/ListActions";
import ListActionsCreate from "@/admin/components/Actions/ListActionsCreate";
import { List } from "@/admin/components/AdminList";
import modules from "@/admin/modules";
import Text from "@/components/elements/Text/Text";
import { useFundingProgrammes } from "@/connections/FundingProgramme";
import { useReportingFrameworks } from "@/connections/ReportingFramework";
import { Forms } from "@/generated/v3/entityService/entityServiceConstants";
import { FormLightDto } from "@/generated/v3/entityService/entityServiceSchemas";

const TYPE_CHOICES = Forms.FORM_TYPES.map(type => ({ id: type, name: type }));

export const FormList: FC = () => {
  const createPath = useCreatePath();
  const renderAttachment = useCallback(
    ({ attachedTo }: FormLightDto) => {
      if (attachedTo == null) return null;

      const { type, name, adminId } = attachedTo;
      if (type === "entity") return name;

      const resource =
        type === "framework"
          ? modules.reportingFramework.ResourceName
          : type === "fundingProgramme"
          ? modules.fundingProgramme.ResourceName
          : undefined;
      if (resource == null || adminId == null) return null;

      return (
        // eslint-disable-next-line jsx-a11y/anchor-is-valid
        <Link to={createPath({ resource, id: adminId, type: "show" })} onClick={e => e.stopPropagation()}>
          {name}
        </Link>
      );
    },
    [createPath]
  );
  const [, { data: fundingProgrammes }] = useFundingProgrammes({ translated: false });
  const [, { data: reportingFrameworks }] = useReportingFrameworks({ translated: false });
  const inUseChoices = useMemo(() => {
    return [
      ...(reportingFrameworks ?? []).map(({ name, slug }) => ({
        name: `Framework: ${name}`,
        id: `framework-${slug}`
      })),
      ...(fundingProgrammes ?? []).map(({ uuid, name }) => ({
        name: `Funding Programme: ${name}`,
        id: `funding-programme-${uuid}`
      }))
    ];
  }, [fundingProgrammes, reportingFrameworks]);

  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Forms
        </Text>
      </Stack>

      <List
        actions={<ListActionsCreate showFilters />}
        filters={[
          <SearchInput key="search" source="search" alwaysOn className="search-page-admin" />,
          <SelectInput key="type" label="Type" source="type" className="select-page-admin" choices={TYPE_CHOICES} />,
          <SelectInput
            key="inUse"
            label="In Use"
            source="attachedTo"
            className="select-page-admin"
            choices={inUseChoices}
          />
        ]}
      >
        <AutoResetSort />
        <Datagrid rowClick="show" bulkActionButtons={false}>
          <ImageField source="banner.url" label="Banner Image" />
          <TextField source="title" label="Title" />
          <TextField source="type" label="Form Type" />
          <FunctionField source="attachedTo" label="In Use" sortable={false} render={renderAttachment} />
        </Datagrid>
      </List>
    </>
  );
};
