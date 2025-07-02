import { useT } from "@transifex/react";
import { useRouter } from "next/router";
import { useMemo, useRef, useState } from "react";
import { Else, If, Then } from "react-if";

import Button from "@/components/elements/Button/Button";
import EmptyState from "@/components/elements/EmptyState/EmptyState";
import ImageGallery from "@/components/elements/ImageGallery/ImageGallery";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import { parsePolygonData } from "@/components/elements/Map-mapbox/utils";
import { IconNames } from "@/components/extensive/Icon/Icon";
import PageCard from "@/components/extensive/PageElements/Card/PageCard";
import { useBoundingBox } from "@/connections/BoundingBox";
import { SupportedEntity, useMedias } from "@/connections/EntityAssociation";
import { getEntitiesOptions } from "@/constants/options/entities";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { GetV2TypeEntityResponse, useDeleteV2FilesUUID, useGetV2TypeEntity } from "@/generated/apiComponents";
import { getCurrentPathEntity } from "@/helpers/entity";
import { useGetImagesGeoJSON } from "@/hooks/useImageGeoJSON";
import { useValueChanged } from "@/hooks/useValueChanged";
import { EntityName, FileType } from "@/types/common";
import { HookFilters, HookProps } from "@/types/connection";
import Log from "@/utils/log";

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
  const contextMapArea = useMapAreaContext();
  const { shouldRefetchMediaData, setShouldRefetchMediaData } = contextMapArea;
  const t = useT();
  const [pagination, setPagination] = useState({ page: 1, pageSize: 10 });
  const [filter, setFilter] = useState<{ key: string; value: string }>();
  const [searchString, setSearchString] = useState<string>("");
  const [isGeotagged, setIsGeotagged] = useState<boolean | null>(null);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [filters, setFilters] = useState<{ isPublic: boolean | undefined; modelType: string | undefined }>({
    isPublic: undefined,
    modelType: undefined
  });
  const mapFunctions = useMap();
  const imageGalleryRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  let entityUUID = router.query.uuid as string;
  if (modelTitle === "Site Report" || modelTitle === "Site") {
    entityUUID = modelUUID;
  }
  const [isLoaded, { data: mediaList, indexTotal, refetch }] = useMedias(
    useMemo<HookProps<typeof useMedias>>(() => {
      const queryFilter: HookFilters<typeof useMedias> = {};

      if (filters.isPublic !== undefined) {
        queryFilter.isPublic = filters.isPublic;
      }
      if (filters.modelType) {
        queryFilter.modelType = filters.modelType;
      }
      queryFilter.search = searchString;

      if (isGeotagged !== null) {
        queryFilter.isGeotagged = isGeotagged;
      }

      if (filter) {
        queryFilter.modelType = filter.value;
      }

      return {
        entity: modelName as SupportedEntity,
        uuid: entityUUID,
        pageNumber: pagination.page,
        pageSize: pagination.pageSize,
        sortDirection: sortOrder,
        filter: queryFilter
      };
    }, [
      entityUUID,
      filter,
      filters.isPublic,
      filters.modelType,
      isGeotagged,
      modelName,
      pagination.page,
      pagination.pageSize,
      searchString,
      sortOrder
    ])
  );

  const { data: sitePolygonData } = useGetV2TypeEntity<GetV2TypeEntityResponse>({
    queryParams: {
      uuid: entityUUID,
      type: modelName
    }
  });

  const mapBbox = useBoundingBox(modelName === "sites" ? { siteUuid: entityUUID } : { projectUuid: entityUUID });
  const polygonDataMap = parsePolygonData(sitePolygonData?.polygonsData);

  const { mutate: deleteFile } = useDeleteV2FilesUUID({
    onSuccess() {
      refetch?.();
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

  useValueChanged(shouldRefetchMediaData, () => {
    if (shouldRefetchMediaData) {
      refetch?.();
      setShouldRefetchMediaData(false);
    }
  });

  const openFormModalHandlerUploadImages = () => {
    openModal(
      ModalId.UPLOAD_IMAGES,
      <ModalAddImages
        title={t("Upload Media")}
        variantFileInput={VARIANT_FILE_INPUT_MODAL_ADD_IMAGES}
        previewAsTable
        descriptionInput={t("drag and drop or browse your device")}
        onClose={() => closeModal(ModalId.UPLOAD_IMAGES)}
        content={t(
          `if operations have begun, please upload images or videos of this specific ${getCurrentPathEntity()}`
        )}
        acceptedTypes={FileType.Image.split(",") as FileType[]}
        primaryButtonText={t("Save")}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            refetch?.();
            closeModal(ModalId.UPLOAD_IMAGES);
          }
        }}
        model={modelName}
        collection="media"
        entityData={entityData}
        setErrorMessage={message => {
          Log.error(message);
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
          modelFilesData={mediaList}
          entityData={entityData}
          imageGalleryRef={imageGalleryRef}
        />
      </PageCard>
      <If condition={indexTotal === 0}>
        <Then>
          <EmptyState
            title={t("Image Gallery is Empty")}
            subtitle={emptyStateContent}
            iconProps={{ name: IconNames.LIGHT_BULB_CIRCLE, className: "fill-success" }}
          />
        </Then>
        <Else>
          <div ref={imageGalleryRef}>
            <PageCard
              title={t("All Images")}
              headerChildren={<Button onClick={openFormModalHandlerUploadImages}>{t("Upload Images")}</Button>}
            >
              <ImageGallery
                data={mediaList ?? []}
                entity={modelName}
                entityData={entityData}
                pageCount={Math.ceil((indexTotal ?? 0) / pagination.pageSize)}
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
                isLoading={!isLoaded}
              />
            </PageCard>
          </div>
        </Else>
      </If>
    </>
  );
};

export default EntityMapAndGalleryCard;
