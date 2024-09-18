import { FC, useEffect, useState } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";
import { When } from "react-if";

import ImageGallery from "@/components/elements/ImageGallery/ImageGallery";
import ImageGalleryItem from "@/components/elements/ImageGallery/ImageGalleryItem";
import { useDeleteV2FilesUUID, useGetV2MODELUUIDFiles } from "@/generated/apiComponents";
import { EntityName } from "@/types/common";

interface IProps extends Omit<TabProps, "label" | "children"> {
  label?: string;
  entity?: EntityName;
}

const GalleryTab: FC<IProps> = ({ label, entity, ...rest }) => {
  const ctx = useShowContext();
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [filter] = useState<string>("all");
  const [searchString, setSearchString] = useState<string>("");
  const [isGeotagged, setIsGeotagged] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<{ isPublic: boolean | undefined; modelType: string | undefined }>({
    isPublic: undefined,
    modelType: undefined
  });
  const resource = entity ?? ctx.resource;

  const queryParams: any = {
    page: pagination.page,
    per_page: pagination.pageSize,
    "filter[file_type]": "media"
  };

  if (filter !== "all") {
    queryParams["filter[is_public]"] = filter === "public";
  }
  if (filters.isPublic !== undefined) {
    queryParams["filter[is_public]"] = filters.isPublic;
  }
  if (filters.modelType) {
    queryParams["filter[model_type]"] = filters.modelType;
  }
  queryParams["search"] = searchString;
  queryParams["is_geotagged"] = isGeotagged;
  queryParams["sort_order"] = sortOrder;
  const { data, refetch, isLoading } = useGetV2MODELUUIDFiles(
    {
      // Currently only projects, sites, nurseries, projectReports, nurseryReports and siteReports are set up
      pathParams: { model: resource, uuid: ctx?.record?.uuid },
      queryParams
    },
    {
      enabled: !!ctx?.record?.uuid
    }
  );

  const { mutate: deleteFile } = useDeleteV2FilesUUID({
    onSuccess() {
      refetch();
    }
  });
  useEffect(() => {
    console.log("is Loadging changed", isLoading);
  }, [isLoading]);
  useEffect(() => {
    refetch();
  }, [filters, pagination, searchString, isGeotagged, sortOrder, refetch]);

  return (
    <When condition={!ctx.isLoading}>
      <TabbedShowLayout.Tab label={label ?? "Gallery"} {...rest}>
        <ImageGallery
          data={
            data?.data?.map(file => ({
              //@ts-ignore
              uuid: file.uuid!,
              fullImageUrl: file.file_url!,
              thumbnailImageUrl: file.thumb_url!,
              label: file.model_name!,
              isPublic: file.is_public!,
              isGeotagged: file?.location?.lat !== 0 && file?.location?.lng !== 0,
              isCover: file.is_cover,
              raw: file
            })) || []
          }
          entity={resource}
          entityData={ctx.record}
          pageCount={data?.meta?.last_page || 1}
          onGalleryStateChange={pagination => {
            setPagination(pagination);
          }}
          onDeleteConfirm={uuid => deleteFile({ pathParams: { uuid } })}
          ItemComponent={ImageGalleryItem}
          onChangeSearch={setSearchString}
          onChangeGeotagged={setIsGeotagged}
          reloadGalleryImages={refetch}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          setFilters={setFilters}
          className="mt-3"
          isAdmin={true}
          isLoading={isLoading}
        />
      </TabbedShowLayout.Tab>
    </When>
  );
};

export default GalleryTab;
