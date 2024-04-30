import { useT } from "@transifex/react";
import { useMemo, useState } from "react";
import { Else, If, Then } from "react-if";

import EmptyState from "@/components/elements/EmptyState/EmptyState";
import ImageGallery from "@/components/elements/ImageGallery/ImageGallery";
// import Map from "@/components/elements/Map-mapbox/Map";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import { getEntitiesOptions } from "@/constants/options/entities";
import { useDeleteV2FilesUUID, useGetV2MODELUUIDFiles } from "@/generated/apiComponents";
import { useGetReadableEntityName } from "@/hooks/entity/useGetReadableEntityName";
import { useDate } from "@/hooks/useDate";
// import { useGetImagesGeoJSON } from "@/hooks/useImageGeoJSON";
// import { useJSONParser } from "@/hooks/useJSONParser";
import { EntityName, SingularEntityName } from "@/types/common";

export interface EntityMapAndGalleryCardProps {
  modelTitle: string;
  modelName: EntityName;
  modelUUID: string;
  boundaryGeojson: string;
  emptyStateContent: string;
}

const EntityMapAndGalleryCard = ({
  modelTitle,
  modelName,
  modelUUID,
  boundaryGeojson,
  emptyStateContent
}: EntityMapAndGalleryCardProps) => {
  const t = useT();
  const { format } = useDate();
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [filter, setFilter] = useState<{ key: string; value: string }>();
  const { getReadableEntityName } = useGetReadableEntityName();
  const queryParams: any = {
    page: pagination.page,
    per_page: pagination.pageSize,
    "filter[file_type]": "media"
  };
  if (filter) {
    queryParams[filter?.key] = filter?.value;
  }

  const { data, refetch } = useGetV2MODELUUIDFiles({
    // Currently only projects, sites, nurseries, projectReports, nurseryReports and siteReports are set up
    pathParams: { model: modelName, uuid: modelUUID },
    queryParams
  });

  const { mutate: deleteFile } = useDeleteV2FilesUUID({
    onSuccess() {
      refetch();
    }
  });

  // const imagesGeoJson = useGetImagesGeoJSON(modelName, modelUUID);
  // const geoJSON = useJSONParser(boundaryGeojson);

  const filterOptions = useMemo(() => {
    const mapping: any = {
      projects: getEntitiesOptions(t),
      sites: [
        {
          value: "sites",
          title: t("Site")
        },
        {
          value: "site-reports",
          title: t("Site Reports")
        }
      ],
      nurseries: [
        {
          value: "nurseries",
          title: t("Nursery")
        },
        {
          value: "nursery-reports",
          title: t("Nursery Reports")
        }
      ]
    };

    return mapping?.[modelName] || [];
  }, [modelName, t]);

  return (
    <>
      <PageCard title={`${modelTitle} ${t("Area")}`}>
        {/* <Map
          className="rounded-lg"
          geojson={geoJSON}
          imageLayerGeojson={imagesGeoJson}
          onDeleteImage={uuid => deleteFile({ pathParams: { uuid } })}
        /> */}
      </PageCard>
      <If
        condition={
          //@ts-expect-error
          data?.meta.unfiltered_total === 0
        }
      >
        <Then>
          <EmptyState
            title={t("Image Gallery is Empty")}
            subtitle={emptyStateContent}
            iconProps={{ name: IconNames.LIGHT_BULB_CIRCLE, className: "fill-success" }}
          />
        </Then>
        <Else>
          <PageCard title={t("All Images")}>
            <ImageGallery
              data={
                data?.data?.map(file => ({
                  //@ts-ignore
                  uuid: file.uuid!,
                  fullImageUrl: file.file_url!,
                  thumbnailImageUrl: file.thumb_url!,
                  label: t("Uploaded via: {entity}", {
                    entity: getReadableEntityName(file.model_name as SingularEntityName, true)
                  }),
                  subtitle: t("Date uploaded: {date}", { date: format(file.created_date) }),
                  isPublic: file.is_public!
                })) || []
              }
              pageCount={data?.meta?.last_page || 1}
              onDeleteConfirm={uuid => deleteFile({ pathParams: { uuid } })}
              onGalleryStateChange={(pagination, filter) => {
                setPagination(pagination);
                setFilter(filter);
              }}
              filterOptions={filterOptions}
              hasFilter={modelName === "sites" || modelName === "projects" || modelName === "nurseries"}
            />
          </PageCard>
        </Else>
      </If>
    </>
  );
};

export default EntityMapAndGalleryCard;
