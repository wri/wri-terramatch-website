import { Typography } from "@mui/material";
import { FC } from "react";
import {
  Datagrid,
  DateField,
  FunctionField,
  Pagination,
  ReferenceField,
  ReferenceManyField,
  TabbedShowLayout,
  TabProps,
  useShowContext
} from "react-admin";
import { When } from "react-if";

import modules from "@/admin/modules";
import { V2AdminUserRead } from "@/generated/apiSchemas";
import { Entity } from "@/types/common";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity?: Entity["entityName"];
}

interface FeedbackProps {
  comment: string | undefined;
}

const Feedback: FC<FeedbackProps> = ({ comment }) => {
  if (comment == null) {
    return <>-</>;
  }

  return (
    <>
      {comment.split("\n").map(fragment => (
        <>
          {fragment}
          <br />
        </>
      ))}
    </>
  );
};

const AuditLogTab: FC<IProps> = ({ label, entity, ...rest }) => {
  const ctx = useShowContext();
  const resource = entity ?? ctx.resource;

  return (
    <When condition={!ctx.isLoading}>
      <TabbedShowLayout.Tab label={label ?? "Audit log"} {...rest}>
        <Typography variant="h5" component="h3">
          Audit Log
        </Typography>
        <ReferenceManyField
          pagination={<Pagination />}
          reference={modules.audit.ResourceName}
          filter={{ entity: resource }}
          target="uuid"
          label=""
        >
          <Datagrid bulkActionButtons={false}>
            <DateField
              source="created_at"
              label="Date and time"
              showTime
              locales="en-GB"
              options={{ dateStyle: "short", timeStyle: "short" }}
            />
            <ReferenceField source="user_uuid" reference={modules.user.ResourceName} label="User">
              <FunctionField
                source="first_name"
                render={(record: V2AdminUserRead) => `${record?.first_name || ""} ${record?.last_name || ""}`}
              />
            </ReferenceField>
            <FunctionField
              label="Action"
              className="capitalize"
              render={(record: any) => {
                const str: string = record?.new_values?.status ?? record?.event ?? "";

                return str.replaceAll("-", " ");
              }}
            />
            <FunctionField
              label="Comments"
              render={(record: any) => <Feedback comment={record?.new_values?.feedback} />}
            />
          </Datagrid>
        </ReferenceManyField>
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default AuditLogTab;
