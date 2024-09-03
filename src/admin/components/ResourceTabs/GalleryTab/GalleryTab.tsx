import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { FC, useState } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import ImageGallery from "@/components/elements/ImageGallery/ImageGallery";
import { useGetV2MODELUUIDFiles } from "@/generated/apiComponents";
import { EntityName } from "@/types/common";

import GalleryImageItem from "./GalleryImageItem";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity?: EntityName;
}

const GalleryTab: FC<IProps> = ({ label, entity, ...rest }) => {
  const ctx = useShowContext();
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [filter, setFilter] = useState<string>("all");
  const [searchString, setSearchString] = useState<string>("");
  const [isGeotagged, setIsGeotagged] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const resource = entity ?? ctx.resource;

  const queryParams: any = {
    page: pagination.page,
    per_page: pagination.pageSize,
    "filter[file_type]": "media"
  };

  if (filter !== "all") {
    queryParams["filter[is_public]"] = filter === "public";
  }
  queryParams["search"] = searchString;
  queryParams["is_geotagged"] = isGeotagged;
  queryParams["sort_order"] = sortOrder;
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
      <TabbedShowLayout.Tab label={label ?? "Gallery"} {...rest}>
        <FormControl sx={{ maxWidth: 200 }} margin="dense">
          <InputLabel id="visibility-label" shrink sx={{ top: -10, fontFamily: "Acumin Pro" }}>
            Visibility
          </InputLabel>
          <Select
            labelId="visibility-label"
            id="visibility-select"
            value={filter}
            label="Visibility"
            onChange={e => {
              setFilter(e.target.value);
            }}
          >
            <MenuItem value="all">All Images</MenuItem>
            <MenuItem value="public">Public</MenuItem>
            <MenuItem value="private">Private</MenuItem>
          </Select>
        </FormControl>
        <ImageGallery
          data={
            data?.data?.map(file => ({
              //@ts-ignore
              uuid: file.uuid!,
              fullImageUrl: file.file_url!,
              thumbnailImageUrl: file.thumb_url!,
              label: file.file_name!,
              isPublic: file.is_public!,
              raw: file
            })) || []
          }
          pageCount={data?.meta?.last_page || 1}
          onGalleryStateChange={pagination => {
            setPagination(pagination);
          }}
          onDeleteConfirm={() => {}}
          ItemComponent={GalleryImageItem}
          hasFilter={false}
          onChangeSearch={setSearchString}
          onChangeGeotagged={setIsGeotagged}
          setSortOrder={setSortOrder}
        />
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default GalleryTab;
