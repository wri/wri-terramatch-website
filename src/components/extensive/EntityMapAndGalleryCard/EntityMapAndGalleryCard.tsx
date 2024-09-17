import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import ImageGallery from "@/components/elements/ImageGallery/ImageGallery";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import { BBox } from "@/components/elements/Map-mapbox/GeoJSON";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import { mapPolygonData } from "@/components/elements/Map-mapbox/utils";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import { getEntitiesOptions } from "@/constants/options/entities";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useModalContext } from "@/context/modal.provider";
import {
  GetV2MODELUUIDFilesResponse,
  GetV2TypeEntityResponse,
  useDeleteV2FilesUUID,
  useGetV2MODELUUIDFiles,
  useGetV2TypeEntity,
  usePostV2FileUploadMODELCOLLECTIONUUID
} from "@/generated/apiComponents";
import { useGetImagesGeoJSON } from "@/hooks/useImageGeoJSON";
import { EntityName, FileType, UploadedFile } from "@/types/common";

import ModalAdd from "../Modal/ModalAdd";
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
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [saveFlag, setSaveFlag] = useState<boolean>(false);
  const [searchString, setSearchString] = useState<string>("");
  const [isGeotagged, setIsGeotagged] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState<{ isPublic: boolean | undefined; modelType: string | undefined }>({
    isPublic: undefined,
    modelType: undefined
  });
  const { showLoader, hideLoader } = useLoading();
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

  const { mutate: uploadFile } = usePostV2FileUploadMODELCOLLECTIONUUID({
    onSuccess() {
      refetch();
    }
  });

  const mapBbox = sitePolygonData?.bbox as BBox;

  const polygonDataMap = mapPolygonData(sitePolygonData?.polygonsData);

  const { data, refetch } = useGetV2MODELUUIDFiles<GetV2MODELUUIDFilesResponse>({
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
      <ModalAdd
        title={t("Upload Images")}
        variantFileInput={VARIANT_FILE_INPUT_MODAL_ADD_IMAGES}
        descriptionInput={t(
          "Drag and drop a geotagged or non-geotagged PNG or JPEG for your site Tannous/Brayton Road."
        )}
        descriptionList={
          <Text variant="text-12-bold" className="mt-9">
            {t("Uploaded Files")}
          </Text>
        }
        onClose={() => closeModal(ModalId.UPLOAD_IMAGES)}
        content={t("Start by adding images for processing.")}
        acceptedTypes={FileType.Image.split(",") as FileType[]}
        primaryButtonText={t("Save")}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            setSaveFlag(true);
          }
        }}
        setFile={setFiles}
      />
    );
  };

  useEffect(() => {
    if (saveFlag) {
      showLoader();
      const uploadPromises = files.map((file: any) => {
        const bodyFiles = new FormData();
        bodyFiles.append("upload_file", file.rawFile);

        return uploadFile({
          pathParams: {
            model: modelName,
            collection: "media",
            uuid: modelUUID
          },
          //@ts-ignore swagger issue
          body: bodyFiles
        });
      });

      Promise.all(uploadPromises)
        .then(() => {
          setSaveFlag(false);
          hideLoader();
          closeModal(ModalId.UPLOAD_IMAGES);
        })
        .catch(error => {
          console.error("Error uploading files:", error);
          hideLoader();
        });
    }
  }, [files, saveFlag, closeModal, modelName, modelUUID, uploadFile, showLoader, hideLoader]);

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
            />
          </PageCard>
        </Else>
      </If>
    </>
  );
};

export default EntityMapAndGalleryCard;
