import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import ImageGallery from "@/components/elements/ImageGallery/ImageGallery";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import { mapPolygonData } from "@/components/elements/Map-mapbox/utils";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import { getEntitiesOptions } from "@/constants/options/entities";
import { useModalContext } from "@/context/modal.provider";
import {
  GetV2MODELUUIDFilesResponse,
  GetV2TypeEntityResponse,
  useDeleteV2FilesUUID,
  useGetV2MODELUUIDFiles,
  useGetV2TypeEntity
} from "@/generated/apiComponents";
import { getCurrentPathEntity } from "@/helpers/entity";
import { useGetImagesGeoJSON } from "@/hooks/useImageGeoJSON";
import { EntityName, FileType } from "@/types/common";

import ModalAddImages from "../Modal/ModalAddImages";
import { ModalId } from "../Modal/ModalConst";

export interface EntityMapAndGalleryCardProps {
  modelTitle: string;
  modelName: EntityName;
  modelUUID: string;
  entityData: any;
  emptyStateContent: string;
}

const EntityMapAndGalleryCard = ({
  modelTitle,
  modelName,
  modelUUID,
  entityData,
  emptyStateContent
}: EntityMapAndGalleryCardProps) => {
  const { openModal, closeModal } = useModalContext();
  const t = useT();
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [filter, setFilter] = useState<{ key: string; value: string }>();
  const [searchString, setSearchString] = useState<string>("");
  const [isGeotagged, setIsGeotagged] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<{ isPublic: boolean | undefined; modelType: string | undefined }>({
    isPublic: undefined,
    modelType: undefined
  });
  const mapFunctions = useMap();
  const router = useRouter();
  const projectUUID = router.query.uuid as string;
  const queryParams: any = {
    page: pagination.page,
    per_page: pagination.pageSize,
    "filter[file_type]": "media"
  };
  if (filter) {
    queryParams[filter?.key] = filter?.value;
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

  const { data: sitePolygonData } = useGetV2TypeEntity<GetV2TypeEntityResponse>({
    queryParams: {
      uuid: projectUUID,
      type: modelName
    }
  });

  const mapBbox = sitePolygonData?.bbox as BBox;

  const polygonDataMap = mapPolygonData(sitePolygonData?.polygonsData);

  const { data, refetch, isLoading } = useGetV2MODELUUIDFiles<GetV2MODELUUIDFilesResponse>({
    // Currently only projects, sites, nurseries, projectReports, nurseryReports and siteReports are set up
    pathParams: { model: modelName, uuid: modelUUID },
    queryParams
  });
  const { mutate: deleteFile } = useDeleteV2FilesUUID({
    onSuccess() {
      refetch();
    }
  });

  const imagesGeoJson = useGetImagesGeoJSON(modelName, modelUUID);

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

  const openFormModalHandlerUploadImages = () => {
    openModal(
      ModalId.UPLOAD_IMAGES,
      <ModalAddImages
        title={t("Upload Media")}
        variantFileInput={VARIANT_FILE_INPUT_MODAL_ADD_IMAGES}
        previewAsTable
        descriptionInput="drag and drop or browse your device"
        onClose={() => closeModal(ModalId.UPLOAD_IMAGES)}
        content={`if operations have begun, please upload images or videos of this specific ${getCurrentPathEntity()}`}
        acceptedTypes={FileType.Image.split(",") as FileType[]}
        primaryButtonText={t("Save")}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            refetch();
            closeModal(ModalId.UPLOAD_IMAGES);
          }
        }}
        model={modelName}
        collection="media"
        uuid={modelUUID}
        setErrorMessage={message => {
          console.error(message);
        }}
      />
    );
  };

  return (
    <>
      <PageCard title={`${modelTitle} ${t("Area")}`}>
        <MapContainer
          polygonsData={polygonDataMap}
          sitePolygonData={sitePolygonData?.polygonsData}
          bbox={mapBbox}
          className="rounded-lg"
          imageLayerGeojson={imagesGeoJson}
          onDeleteImage={uuid => deleteFile({ pathParams: { uuid } })}
          mapFunctions={mapFunctions}
          showLegend
          hasControls
          showPopups
          modelFilesData={data?.data}
        />
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
          <PageCard
            title={t("All Images")}
            headerChildren={<Button onClick={openFormModalHandlerUploadImages}>{t("Upload Images")}</Button>}
          >
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
              entity={modelName}
              entityData={entityData}
              pageCount={data?.meta?.last_page || 1}
              onDeleteConfirm={uuid => deleteFile({ pathParams: { uuid } })}
              onGalleryStateChange={(pagination, filter) => {
                setPagination(pagination);
                setFilter(filter);
              }}
              filterOptions={filterOptions}
              onChangeSearch={setSearchString}
              onChangeGeotagged={setIsGeotagged}
              reloadGalleryImages={refetch}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
              setFilters={setFilters}
              isLoading={isLoading}
            />
          </PageCard>
        </Else>
      </If>
    </>
  );
};

export default EntityMapAndGalleryCard;
