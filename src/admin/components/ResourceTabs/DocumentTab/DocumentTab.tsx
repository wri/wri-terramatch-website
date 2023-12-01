import { Card, Typography } from "@mui/material";
import { FC } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import List from "@/components/extensive/List/List";
import { useGetV2MODELUUIDFiles } from "@/generated/apiComponents";
import { useDate } from "@/hooks/useDate";
import { useGetReadableEntityName } from "@/hooks/useGetReadableEntityName";
import { EntityName } from "@/types/common";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity: EntityName;
}

const DocumentTab: FC<IProps> = ({ label, entity, ...rest }) => {
  const ctx = useShowContext();
  const resource = entity ?? ctx.resource;
  const { getReadableEntityName } = useGetReadableEntityName();
  const { format } = useDate();

  const queryParams: any = {
    page: 1,
    per_page: 1000,
    "filter[file_type]": "documents"
  };

  const { data } = useGetV2MODELUUIDFiles(
    {
      // Currently only projects, sites, nurseries, projectReports, nurseryReports and siteReports are set up
      pathParams: { model: resource, uuid: ctx?.record?.uuid },
      queryParams
    },
    {
      enabled: !!ctx?.record?.uuid
    }
  );

  return (
    <When condition={!ctx.isLoading}>
      <TabbedShowLayout.Tab label={label ?? "Documents"} {...rest}>
        {data?.data?.length === 0 ? (
          <Card sx={{ padding: 4 }}>
            <Typography variant="h5" component="h3" sx={{ marginBottom: 2 }}>
              No Documents
            </Typography>
            <Typography>
              This {getReadableEntityName(entity, true).toLowerCase()} does not have any documents available
            </Typography>
          </Card>
        ) : (
          <Card sx={{ padding: 4 }}>
            <Typography variant="h5" component="h3" sx={{ marginBottom: 2 }}>
              {getReadableEntityName(entity, true)} Documents
            </Typography>
            <List
              className="my-4 flex flex-col gap-4"
              items={data?.data || []}
              render={(entry: any) => {
                return (
                  <div>
                    <Typography variant="h6" component="h4" className="!mb-2 !text-sm uppercase">
                      Document
                    </Typography>
                    <a href={entry.file_url} target="_blank" rel="noreferrer noopenner">
                      {entry.file_name}
                    </a>
                    <Typography variant="body2">Date uploaded: {format(entry.created_date)}</Typography>
                    <Typography variant="body2">Visibility: {entry.is_public ? "Public" : "Private"}</Typography>
                  </div>
                );
              }}
            />
          </Card>
        )}
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default DocumentTab;
