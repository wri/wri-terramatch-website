import { Card, Typography } from "@mui/material";
import { FC, useMemo } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import List from "@/components/extensive/List/List";
import { useMedias } from "@/connections/EntityAssocation";
import { SupportedEntity } from "@/connections/EntityAssocation";
import { MediaDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useGetReadableEntityName } from "@/hooks/entity/useGetReadableEntityName";
import { useDate } from "@/hooks/useDate";
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

  const queryParams = useMemo(
    () => ({
      "page[number]": 1,
      "page[size]": 1000,
      fileType: "documents"
    }),
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, { associations: mediaList }] = useMedias({
    entity: resource as SupportedEntity,
    uuid: ctx?.record?.uuid,
    queryParams
  });

  return (
    <When condition={!ctx.isLoading}>
      <TabbedShowLayout.Tab label={label ?? "Documents"} {...rest}>
        {mediaList?.length === 0 ? (
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
              items={mediaList || []}
              render={(entry: MediaDto) => {
                return (
                  <div>
                    <Typography variant="h6" component="h4" className="!mb-2 !text-sm uppercase">
                      Document
                    </Typography>
                    <a href={entry.url} target="_blank" rel="noreferrer noopenner">
                      {entry.fileName}
                    </a>
                    <Typography variant="body2">Date uploaded: {format(entry.createdAt)}</Typography>
                    <Typography variant="body2">Visibility: {entry.isPublic ? "Public" : "Private"}</Typography>
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
