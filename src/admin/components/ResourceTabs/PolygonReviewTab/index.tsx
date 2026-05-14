import { Grid, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import { SortingState } from "@tanstack/react-table";
import { useT } from "@transifex/react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TabbedShowLayout, TabProps, useShowContext } from "react-admin";

import ModalApprove from "@/admin/components/extensive/Modal/ModalApprove";
import Button from "@/components/elements/Button/Button";
import { VARIANT_FILE_INPUT_MODAL_ADD_IMAGES } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import { zoomToBbox } from "@/components/elements/Map-mapbox/adapters/camera";
import { useMap } from "@/components/elements/Map-mapbox/hooks/useMap";
import { MapContainer } from "@/components/elements/Map-mapbox/Map";
import {
  addSourcesToLayers,
  countStatusesV3,
  downloadSiteGeoJsonPolygons,
  parsePolygonDataV3,
  storePolygon
} from "@/components/elements/Map-mapbox/utils";
import LinearProgressBarMonitored from "@/components/elements/ProgressBar/LinearProgressBar/LineProgressBarMonitored";
import Text from "@/components/elements/Text/Text";
import ToolTip from "@/components/elements/Tooltip/Tooltip";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { pruneBoundingBoxesCache, useBoundingBox } from "@/connections/BoundingBox";
import { useDelayedJobs } from "@/connections/DelayedJob";
import { pruneEntityCache } from "@/connections/Entity";
import { useMedias } from "@/connections/EntityAssociation";
import {
  prepareGeometryForUpload,
  useCompareGeometry,
  useUploadGeometry,
  useUploadGeometryWithVersions
} from "@/connections/GeometryUpload";
import { bulkUpdateSitePolygonStatus, deleteSitePolygon, pruneSitePolygonsCache } from "@/connections/SitePolygons";
import { AnrMapOverlayProvider } from "@/context/anrMapOverlay.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useMonitoredDataContext } from "@/context/monitoredData.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { SitePolygonDataProvider } from "@/context/sitePolygon.provider";
import { listDelayedJobs } from "@/generated/v3/jobService/jobServiceComponents";
import {
  CompareGeometryFileResponse,
  uploadGeometryFile,
  UploadGeometryFileError
} from "@/generated/v3/researchService/researchServiceComponents";
import { SitePolygonLightDto } from "@/generated/v3/researchService/researchServiceSchemas";
import useLoadSitePolygonsData from "@/hooks/paginated/useLoadSitePolygonData";
import { useValueChanged } from "@/hooks/useValueChanged";
import ApiSlice from "@/store/apiSlice";
import { EntityName, FileType, UploadedFile } from "@/types/common";
import Log from "@/utils/log";

import ModalIdentified from "../../extensive/Modal/ModalIdentified";
import AddDataButton from "./components/AddDataButton";
import SitePolygonReviewAside from "./components/PolygonReviewAside";
import { IpolygonFromMap } from "./components/Polygons";
import SiteAttributeTable from "./components/SiteAttributeTable/SiteAttributeTable";

interface IProps extends Omit<TabProps, "label" | "children"> {
  type: EntityName;
  label: string;
  setIsLoadingDelayedJob?: (isLoading: boolean) => void;
  isLoadingDelayedJob?: boolean;
  setAlertTitle?: (value: string) => void;
}

export type SitePolygonRow = {
  "polygon-name": string;
  "restoration-practice": string[];
  "target-land-use-system": string;
  "tree-distribution": string[];
  "planting-start-date": string;
  "num-trees": number;
  "calc-area": number;
  source: string;
  uuid?: string;
  ellipse: boolean;
};

export type PolygonTotals = {
  totalTreesPlanted: number;
  totalCalculatedArea: number;
};
export interface IPolygonItem {
  id: string;
  status: "draft" | "submitted" | "approved" | "needs-more-information";
  label: string;
  uuid: string;
}

const PolygonReviewAside: FC<{
  type: EntityName;
  data: IPolygonItem[];
  polygonFromMap: IpolygonFromMap;
  setPolygonFromMap: any;
  refresh?: () => void;
  mapFunctions: any;
  totalPolygons?: number;
  siteUuid?: string;
  isLoading?: boolean;
  progress?: number;
}> = ({
  type,
  data,
  polygonFromMap,
  setPolygonFromMap,
  refresh,
  mapFunctions,
  totalPolygons,
  siteUuid,
  isLoading,
  progress
}) => {
  switch (type) {
    case "sites":
      return (
        <SitePolygonReviewAside
          data={data}
          polygonFromMap={polygonFromMap}
          setPolygonFromMap={setPolygonFromMap}
          mapFunctions={mapFunctions}
          refresh={refresh}
          totalPolygons={totalPolygons}
          progress={progress}
          siteUuid={siteUuid}
          isLoading={isLoading}
        />
      );
    default:
      return null;
  }
};

const ContentForApproval = ({
  polygonsForApprovals,
  recordName
}: {
  polygonsForApprovals: SitePolygonLightDto[];
  recordName: string;
}) => (
  <>
    <div>
      <Text variant="text-14-bold" as="p">
        {recordName}
      </Text>
      <ul style={{ listStyleType: "circle" }}>
        {polygonsForApprovals?.map(polygon => (
          <li key={polygon.uuid}>
            <Text variant="text-12-light" as="p">
              {polygon?.name ?? "Unnamed Polygon"}
            </Text>
          </li>
        ))}
      </ul>
    </div>
  </>
);

const PolygonReviewTab: FC<IProps> = props => {
  const { isLoading: ctxLoading, record } = useShowContext();
  const { selectPolygonFromMap, setSelectPolygonFromMap } = useMonitoredDataContext();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [saveFlags, setSaveFlags] = useState<boolean>(false);
  const [pendingValidationRefresh, setPendingValidationRefresh] = useState<boolean>(false);
  const [pendingJobUuids, setPendingJobUuids] = useState<Set<string>>(new Set());
  const [processedValidationJobs, setProcessedValidationJobs] = useState<Set<string>>(new Set());

  const [, { delayedJobs }] = useDelayedJobs();

  const polygonFromMap = selectPolygonFromMap ?? { isOpen: false, uuid: "" };
  const setPolygonFromMap = useCallback(
    (value: IpolygonFromMap | ((prev: IpolygonFromMap) => IpolygonFromMap)) => {
      if (setSelectPolygonFromMap) {
        const newValue =
          typeof value === "function" ? value(selectPolygonFromMap ?? { isOpen: false, uuid: "" }) : value;
        setSelectPolygonFromMap(newValue);
      }
    },
    [setSelectPolygonFromMap, selectPolygonFromMap]
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    setSelectedPolygonsInCheckbox,
    setPolygonData,
    polygonData: polygonList,
    shouldRefetchValidation,
    setShouldRefetchValidation,
    validFilter,
    isUserDrawingEnabled
  } = useMapAreaContext();
  const [submitPolygonLoaded, setSubmitPolygonLoaded] = useState<boolean>(false);
  // Local table pagination/sorting over the full dataset already loaded for the map
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(20);
  const [sorting, setSorting] = useState<SortingState>([]);
  const t = useT();

  const { openNotification } = useNotificationContext();
  const uploadGeometry = useUploadGeometry({});
  const compareGeometry = useCompareGeometry({});
  const uploadGeometryWithVersions = useUploadGeometryWithVersions({});

  const isValidBbox = (b: unknown): b is [number, number, number, number] =>
    Array.isArray(b) && b.length === 4 && (b as unknown[]).every(n => typeof n === "number");

  const siteBbox = useBoundingBox({ siteUuid: record?.uuid });
  const activeBbox = isValidBbox(siteBbox) ? siteBbox : undefined;

  const [currentPolygonUuid, setCurrentPolygonUuid] = useState<string | undefined>(undefined);
  const polygonBboxForFly = useBoundingBox(currentPolygonUuid != null ? { polygonUuid: currentPolygonUuid } : {});

  const {
    data: sitePolygonData,
    refetch,
    loading,
    total,
    progress
  } = useLoadSitePolygonsData(record?.uuid ?? "", "sites", undefined, "createdAt", "ASC", validFilter);

  const onSave = (geojson: any, record: any) => {
    storePolygon(geojson, record, setSelectPolygonFromMap, refetch);
  };
  const mapFunctions = useMap(onSave);

  useEffect(() => {
    if (isUserDrawingEnabled === true) {
      return;
    }
    if (isValidBbox(polygonBboxForFly) && mapFunctions.map?.current != null) {
      zoomToBbox(polygonBboxForFly, mapFunctions.map.current, true);
      setCurrentPolygonUuid(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [polygonBboxForFly, isUserDrawingEnabled]);

  const flyToPolygonBounds = useCallback(async (uuid: string) => {
    setCurrentPolygonUuid(uuid);
  }, []);

  useEffect(() => {
    if (isUserDrawingEnabled === true) {
      return;
    }
    if (selectPolygonFromMap?.uuid != null && selectPolygonFromMap.uuid !== "") {
      flyToPolygonBounds(selectPolygonFromMap.uuid);
    }
  }, [flyToPolygonBounds, selectPolygonFromMap?.uuid, isUserDrawingEnabled]);

  const [, { data: mediaFiles }] = useMedias({
    entity: "sites",
    uuid: record?.uuid,
    enabled: record?.uuid != null
  });

  useValueChanged(validFilter, () => {
    refetch();
  });

  const sitePolygonDataTable: SitePolygonRow[] = useMemo(
    () =>
      (sitePolygonData ?? []).map(
        (data: SitePolygonLightDto, index): SitePolygonRow => ({
          "polygon-name": data?.name ?? `Unnamed Polygon`,
          "restoration-practice": data?.practice ?? [],
          "target-land-use-system": data?.targetSys ?? "",
          "tree-distribution": data?.distr ?? [],
          "planting-start-date": data?.plantStart ?? "",
          "num-trees": data?.numTrees ?? 0,
          "calc-area": data?.calcArea ?? 0,
          source: data?.source ?? "",
          uuid: data?.polygonUuid ?? undefined,
          ellipse: index === (sitePolygonData ?? []).length - 1
        })
      ),
    [sitePolygonData]
  );

  // Stable client-side sorting across the full dataset, then paginate
  const sortedData = useMemo<SitePolygonRow[]>(() => {
    if (!sorting?.length) return sitePolygonDataTable;
    const sorters = sorting.map(s => ({ id: s.id, desc: s.desc }));
    const getComparable = (value: unknown): string | number => {
      if (value == null) return "";
      if (typeof value === "number") return value;
      const str = String(value);
      const timestamp = Date.parse(str);
      if (!Number.isNaN(timestamp) && /\d{4}-\d{2}-\d{2}/.test(str)) return timestamp;
      return str.toLowerCase();
    };
    const dataWithIndex = sitePolygonDataTable.map((row, idx) => ({ row, idx }));
    dataWithIndex.sort((a, b) => {
      for (const s of sorters) {
        const key = s.id as keyof SitePolygonRow;
        const av = getComparable(a.row[key]);
        const bv = getComparable(b.row[key]);
        if (av < bv) return s.desc ? 1 : -1;
        if (av > bv) return s.desc ? -1 : 1;
      }
      return a.idx - b.idx;
    });
    return dataWithIndex.map(d => d.row);
  }, [sitePolygonDataTable, sorting]);

  const totalItems = sortedData.length;
  const totalPages = Math.ceil(Math.max(1, totalItems) / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = sortedData.slice(startIndex, endIndex);

  const transformedSiteDataForList = (sitePolygonData ?? []).map((data: SitePolygonLightDto, index: number) => ({
    id: (index + 1).toString(),
    status: data.status,
    label: data.name ?? `Unnamed Polygon`,
    uuid: data.polygonUuid,
    validationStatus: data.validationStatus ?? "notChecked"
  }));

  const polygonDataMap = useMemo(() => parsePolygonDataV3(sitePolygonData), [sitePolygonData]);

  const dataPolygonOverview = countStatusesV3(sitePolygonData);

  const { openModal, closeModal } = useModalContext();

  const deletePolygon = async (uuid: string) => {
    try {
      await deleteSitePolygon(uuid);
      pruneBoundingBoxesCache();
      refetch?.();
      const { map } = mapFunctions;
      if (map?.current) {
        addSourcesToLayers(map.current, polygonDataMap, undefined);
      }
      closeModal(ModalId.DELETE_POLYGON);
    } catch (error) {
      Log.error("Error deleting polygon:", error);
    }
  };

  const openFormModalHandlerConfirmDeletion = (uuid: string) => {
    const sitePolygon = sitePolygonData?.find(polygon => polygon.polygonUuid === uuid);
    const sitePolygonUuid = sitePolygon?.uuid;
    if (!sitePolygonUuid) {
      Log.error("Site polygon not found", { uuid });
      return;
    }
    openModal(
      ModalId.DELETE_POLYGON,
      <ModalConfirm
        title={"Confirm Polygon Deletion"}
        content="Do you want to delete this polygon?"
        onClose={() => closeModal(ModalId.DELETE_POLYGON)}
        onConfirm={() => {
          deletePolygon(sitePolygonUuid);
        }}
      />
    );
  };

  const isVersioningUploadRef = useRef<boolean>(false);

  useEffect(() => {
    if (files && files.length > 0 && saveFlags) {
      uploadFiles();
      setSaveFlags(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, saveFlags]);

  useEffect(() => {
    if (errorMessage) {
      openNotification("error", t("Error uploading file"), t(errorMessage));
      setErrorMessage(null);
    }
  }, [errorMessage, openNotification, t]);

  useEffect(() => {
    setPolygonData(sitePolygonData);
  }, [loading, setPolygonData, sitePolygonData]);

  useEffect(() => {
    if (shouldRefetchValidation) {
      refetch();
      setShouldRefetchValidation(false);
    }
  }, [refetch, setShouldRefetchValidation, shouldRefetchValidation]);

  useEffect(() => {
    if (pendingValidationRefresh && delayedJobs && delayedJobs.length > 0) {
      const pendingUuids = new Set(delayedJobs.filter(job => job.status === "pending").map(job => job.uuid));
      if (pendingUuids.size > 0) {
        setPendingJobUuids(pendingUuids);
      }
    }
  }, [pendingValidationRefresh, delayedJobs]);

  useEffect(() => {
    if (delayedJobs == null || record == null || pendingValidationRefresh) return;

    const hasActiveValidationJob = delayedJobs.some(
      job => job.name === "Polygon Validation" && job.status === "pending"
    );

    if (hasActiveValidationJob) {
      setPendingValidationRefresh(true);
      listDelayedJobs.fetch({});
    }
  }, [delayedJobs, pendingValidationRefresh, record]);

  useEffect(() => {
    if (!pendingValidationRefresh || !delayedJobs || delayedJobs.length === 0 || record == null) {
      return;
    }

    const siteUuid = record.uuid;
    const projectUuid = "projectUuid" in record ? record.projectUuid : null;

    const completedJobs = delayedJobs.filter(job => {
      if (processedValidationJobs.has(job.uuid)) return false;

      const isCompleted = job.status === "succeeded" || job.status === "failed";
      if (!isCompleted) return false;

      const wasTracked = pendingJobUuids.has(job.uuid);
      const matchesSite = job.payload?.data?.attributes?.siteUuid === siteUuid;
      const matchesProject = projectUuid != null && job.payload?.data?.attributes?.projectUuid === projectUuid;

      return wasTracked || matchesSite || matchesProject;
    });

    if (completedJobs.length > 0) {
      if (projectUuid != null) {
        pruneEntityCache("projects", projectUuid);
        ApiSlice.pruneIndex("projects", "");
      }

      pruneEntityCache("sites", siteUuid);
      ApiSlice.pruneIndex("sites", "");

      pruneSitePolygonsCache();

      ApiSlice.pruneCache("validations");
      ApiSlice.pruneIndex("validations", "");

      if (Array.isArray(sitePolygonData)) {
        const polygonUuids = sitePolygonData
          .map(polygon => polygon.polygonUuid)
          .filter((uuid): uuid is string => Boolean(uuid));
        if (polygonUuids.length > 0) {
          ApiSlice.pruneCache("validations", polygonUuids);
        }
      }

      setProcessedValidationJobs(prev => {
        const next = new Set(prev);
        completedJobs.forEach(j => next.add(j.uuid));
        return next;
      });

      refetch();
      setShouldRefetchValidation(true);

      setPendingValidationRefresh(false);
      setPendingJobUuids(new Set());
    }
  }, [
    delayedJobs,
    pendingValidationRefresh,
    pendingJobUuids,
    processedValidationJobs,
    record,
    refetch,
    sitePolygonData,
    setShouldRefetchValidation
  ]);

  const extractErrorMessage = (error: unknown): string => {
    if (error && typeof error === "object" && "error" in error) {
      const nestedError = error.error;
      if (typeof nestedError === "string") {
        try {
          const parsedNestedError = JSON.parse(nestedError);
          if (parsedNestedError && typeof parsedNestedError === "object" && "message" in parsedNestedError) {
            return parsedNestedError.message;
          }
          return nestedError;
        } catch {
          return nestedError;
        }
      }
      return String(nestedError);
    }
    if (error && typeof error === "object" && "message" in error) {
      return String(error.message);
    }
    return t("An unknown error occurred");
  };

  const uploadPolygonsNew = async (siteUuid: string): Promise<void> => {
    const uploadPromises = files.map(
      file =>
        new Promise((resolve, reject) => {
          const fileToUpload = file.rawFile as File;
          const attributes = prepareGeometryForUpload(fileToUpload, siteUuid);

          uploadGeometry(attributes, {
            onSuccess: (response: Awaited<ReturnType<typeof uploadGeometryFile.fetchParallel>>) => resolve(response),
            onError: (error: UploadGeometryFileError) => reject(error)
          });
        })
    );

    try {
      await Promise.all(uploadPromises);
      pruneBoundingBoxesCache();
      openNotification("success", t("Success!"), t("Polygon uploaded successfully"));
      refetch();
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      openNotification("error", t("Error uploading file"), errorMessage);
    }
  };

  const uploadPolygonsWithVersioning = async (siteUuid: string): Promise<void> => {
    const isPreviewMode = !submitPolygonLoaded;

    try {
      if (isPreviewMode) {
        const file = files[0];
        if (!file) {
          openNotification("error", t("Error"), t("No file selected"));
          return;
        }

        const fileToUpload = file.rawFile as File;
        const attributes = prepareGeometryForUpload(fileToUpload, siteUuid);

        compareGeometry(attributes, {
          onSuccess: (response: CompareGeometryFileResponse) => {
            const dataArray = Array.isArray(response.data)
              ? response.data
              : response.data != null
              ? [response.data]
              : [];
            const responseAttributes = dataArray[0]?.attributes;
            const existingUuids = responseAttributes?.existingUuids ?? [];
            const summary = {
              featuresForVersioning: responseAttributes?.featuresForVersioning ?? 0,
              featuresForCreation: responseAttributes?.featuresForCreation ?? 0,
              totalFeatures: responseAttributes?.totalFeatures ?? 0
            };

            openFormModalHandlerIdentifiedPolygons(existingUuids, summary);
          },
          onError: (error: any) => {
            const errorMessage = extractErrorMessage(error);
            openNotification("error", t("Error uploading file"), errorMessage);
          }
        });
      } else {
        const uploadPromises = files.map(
          file =>
            new Promise((resolve, reject) => {
              const fileToUpload = file.rawFile as File;
              const attributes = prepareGeometryForUpload(fileToUpload, siteUuid);

              uploadGeometryWithVersions(attributes, {
                onSuccess: (response: any) => resolve(response),
                onError: (error: any) => reject(error)
              });
            })
        );

        await Promise.all(uploadPromises);
        pruneBoundingBoxesCache();
        openNotification("success", t("Success!"), t("Polygons versioned successfully"));
        refetch();
      }
    } catch (error) {
      const errorMessage = extractErrorMessage(error);
      openNotification("error", t("Error uploading file"), errorMessage);
    }
  };

  const uploadFiles = async (): Promise<void> => {
    const siteUuid = record?.uuid;
    if (!siteUuid) {
      openNotification("error", t("Error"), t("Site UUID is required"));
      return;
    }

    const isVersioningUpload = isVersioningUploadRef.current || submitPolygonLoaded;

    if (isVersioningUpload) {
      closeModal(ModalId.REPLACEMENT_POLYGONS);
    } else {
      closeModal(ModalId.ADD_POLYGON);
    }

    try {
      if (isVersioningUpload) {
        await uploadPolygonsWithVersioning(siteUuid);
      } else {
        await uploadPolygonsNew(siteUuid);
      }
    } finally {
      setSubmitPolygonLoaded(false);
      isVersioningUploadRef.current = false;
    }
  };

  const openFormModalHandlerAddPolygon = () => {
    setSubmitPolygonLoaded(false);
    isVersioningUploadRef.current = false;
    openModal(
      ModalId.ADD_POLYGON,
      <ModalAdd
        title="Add Polygons"
        descriptionInput={`Drag and drop a GeoJSON, Shapefile, or KML for your site ${record?.name ?? ""}.`}
        descriptionList={
          <div className="mt-9 flex">
            <Text variant="text-12-bold">TerraMatch upload limits:&nbsp;</Text>
            <Text variant="text-12-light">50 MB per upload</Text>
          </div>
        }
        onClose={() => closeModal(ModalId.ADD_POLYGON)}
        content="Start by adding polygons to your site."
        primaryButtonText="Save"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: () => setSaveFlags(true) }}
        acceptedTypes={FileType.AcceptedShapefiles.split(",") as FileType[]}
        maxFileSize={2 * 1024 * 1024}
        setErrorMessage={setErrorMessage}
        setFile={setFiles}
      />
    );
  };
  const openFormModalHandlerConfirm = (polygonsForApprovals: SitePolygonLightDto[], recordName: string) => {
    openModal(
      ModalId.CONFIRM_POLYGON_APPROVAL,
      <ModalConfirm
        title={"Confirm Polygon Approval"}
        content={<ContentForApproval polygonsForApprovals={polygonsForApprovals} recordName={recordName} />}
        commentArea
        onClose={() => closeModal(ModalId.CONFIRM_POLYGON_APPROVAL)}
        onConfirm={async data => {
          closeModal(ModalId.CONFIRM_POLYGON_APPROVAL);
          try {
            await bulkUpdateSitePolygonStatus(
              polygonsForApprovals.map(polygon => polygon.uuid),
              "approved",
              data
            );
            openNotification("success", "Success, Your Polygons were approved!", "");

            const siteUuid = record?.uuid;
            const projectUuid =
              "projectUuid" in (record ?? {}) ? (record as { projectUuid?: string | null }).projectUuid : null;

            if (projectUuid) {
              pruneEntityCache("projects", projectUuid);
              ApiSlice.pruneIndex("projects", "");
            }
            if (siteUuid) {
              pruneEntityCache("sites", siteUuid);
              ApiSlice.pruneIndex("sites", "");
            }
            pruneSitePolygonsCache();
            ApiSlice.pruneCache("validations");
            ApiSlice.pruneIndex("validations", "");

            if (sitePolygonData && Array.isArray(sitePolygonData)) {
              const polygonUuids = sitePolygonData
                .map(polygon => polygon.polygonUuid)
                .filter((uuid): uuid is string => Boolean(uuid));
              if (polygonUuids.length > 0) {
                ApiSlice.pruneCache("validations", polygonUuids);
              }
            }

            const refetchResult = refetch() as unknown;
            if (refetchResult && typeof refetchResult === "object" && "then" in refetchResult) {
              await (refetchResult as Promise<void>);
            }

            setPendingValidationRefresh(true);
            await listDelayedJobs.fetch({});
          } catch (error) {
            Log.error("Polygon approval error", error);
            setPendingValidationRefresh(false);
          }
        }}
      />
    );
  };

  const openFormModalHandlerUploadImages = () => {
    openModal(
      ModalId.UPLOAD_IMAGES,
      <ModalAdd
        title="Upload Images"
        variantFileInput={VARIANT_FILE_INPUT_MODAL_ADD_IMAGES}
        descriptionInput={`Drag and drop a geotagged or non-geotagged PNG, GIF or JPEG for your site ${
          record?.name ?? ""
        }.`}
        descriptionList={
          <Text variant="text-12-bold" className="mt-9">
            Uploaded Files
          </Text>
        }
        onClose={() => closeModal(ModalId.UPLOAD_IMAGES)}
        content="Start by adding images for processing."
        primaryButtonText="Save"
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => closeModal(ModalId.APPROVE_POLYGONS)
        }}
      />
    );
  };

  const openFormModalHandlerAddPolygons = () => {
    openModal(
      ModalId.REPLACEMENT_POLYGONS,
      <ModalAdd
        title={t("Download All Polygons")}
        secondTitle={t("Upload All Polygons")}
        descriptionInput={t("Drag and drop a single GeoJSON, KML or SHP to create a new version of your polygon.")}
        descriptionList={
          <div className="mt-9 flex">
            <Text variant="text-12-bold">{t("TerraMatch upload limits")}:&nbsp;</Text>
            <Text variant="text-12-light">{t("50 MB per upload")}</Text>
          </div>
        }
        onClose={() => {
          closeModal(ModalId.REPLACEMENT_POLYGONS);
          setSubmitPolygonLoaded(false);
          isVersioningUploadRef.current = false;
        }}
        content={t(
          "Click the button below to download all polygons related to the site. All Available attributes - including the Site indentifier (UUID) - are included."
        )}
        secondContent={t(
          "As a single SHP, KML or GeoJSON, upload all polygons (and make sure to include the Site identifier)."
        )}
        primaryButtonText={t("Next")}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            isVersioningUploadRef.current = true;
            setSubmitPolygonLoaded(false);
            setSaveFlags(true);
          }
        }}
        acceptedTypes={FileType.AcceptedShapefiles.split(",") as FileType[]}
        setFile={setFiles}
        allowMultiple={false}
        btnDownload={true}
        btnDownloadProps={{
          onClick: () => {
            downloadSiteGeoJsonPolygons(record?.uuid ?? "", record?.name ?? "sitePolygons");
          }
        }}
      />
    );
  };

  const openFormModalHandlerSubmitPolygon = () => {
    openModal(
      ModalId.APPROVE_POLYGONS,
      <ModalApprove
        title="Approve Polygons"
        site={record}
        onClose={() => closeModal(ModalId.APPROVE_POLYGONS)}
        content="Administrators may approve polygons only if all checks pass."
        primaryButtonText="Next"
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: (polygons: unknown) => {
            closeModal(ModalId.APPROVE_POLYGONS);
            openFormModalHandlerConfirm(polygons as SitePolygonLightDto[], record?.name ?? "");
          }
        }}
        secondaryButtonText="Cancel"
        secondaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => closeModal(ModalId.APPROVE_POLYGONS)
        }}
        polygonList={polygonList}
      />
    );
  };

  const openFormModalHandlerIdentifiedPolygons = (
    existingUuids: string[],
    summary?: { featuresForVersioning: number; featuresForCreation: number; totalFeatures: number }
  ) => {
    openModal(
      ModalId.IDENTIFIED_POLYGONS,
      <ModalIdentified
        title={t("Polygons Identified")}
        existingUuids={existingUuids}
        siteUuid={record?.uuid ?? ""}
        summary={summary}
        setSubmitPolygonLoaded={setSubmitPolygonLoaded}
        setSaveFlags={setSaveFlags}
        onClose={() => {
          closeModal(ModalId.IDENTIFIED_POLYGONS);
        }}
        content={t(
          "Based on the recent upload, the following polygons were identified and will be used to create new versions. Polygons within the site that are not shown have not been uploaded will not be affected."
        )}
        primaryButtonText={t("Submit")}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            isVersioningUploadRef.current = true;
            setSubmitPolygonLoaded(true);
            setSaveFlags(true);
            closeModal(ModalId.REPLACEMENT_POLYGONS);
            closeModal(ModalId.IDENTIFIED_POLYGONS);
          }
        }}
        secondaryButtonText={t("Cancel")}
        secondaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => {
            setSubmitPolygonLoaded(false);
            isVersioningUploadRef.current = false;
            closeModal(ModalId.IDENTIFIED_POLYGONS);
            setSaveFlags(false);
          }
        }}
      />
    );
  };

  if (ctxLoading) return null;

  return (
    <SitePolygonDataProvider sitePolygonData={sitePolygonData} reloadSiteData={refetch}>
      <AnrMapOverlayProvider>
        <TabbedShowLayout.Tab {...props}>
          <Grid spacing={2} container>
            <Grid xs={9}>
              <Stack gap={4} className="pt-9 pl-8">
                <div className="flex flex-col items-start gap-3" ref={containerRef}>
                  <div className="mb-2 flex w-full gap-2 rounded-xl border-2 border-grey-350 bg-white p-3 shadow-monitored">
                    <div className="w-40 lg:w-48">
                      <Text variant="text-14" className="flex items-center gap-1 text-darkCustom">
                        Site Status
                        <ToolTip
                          title={""}
                          content={
                            "Site status indicates the current status of the site. Active sites that have been approved by project managers will have the status: Restoration in Progress."
                          }
                          width="w-64 lg:w-72"
                          trigger="click"
                        >
                          <Icon name={IconNames.IC_INFO} className="h-3.5 w-3.5 text-darkCustom lg:h-4 lg:w-4" />
                        </ToolTip>
                      </Text>
                      <Text variant="text-14-bold" className="leading-[normal] text-black">
                        {record?.readable_status}
                      </Text>
                    </div>
                    <div className="w-full">
                      <Text variant="text-14" className="mb-2 flex items-center gap-1 text-darkCustom">
                        Polygon Overview
                        <ToolTip
                          title=""
                          content={`This graphic displays the breakdown of polygon statuses for this site. Approved Polygons are ready for monitoring, but all other statuses require polygon validation and approval. Use the 'Check Polygon' and 'Approve Polygon' features below to validate and approve the remaining polygons.`}
                          width="w-72 lg:w-80"
                          trigger="click"
                        >
                          <Icon name={IconNames.IC_INFO} className="h-3.5 w-3.5 text-darkCustom lg:h-4 lg:w-4" />
                        </ToolTip>
                      </Text>
                      {sitePolygonData.length < total ? (
                        <Box sx={{ width: "100%" }}>
                          <LinearProgress sx={{ borderRadius: 5 }} />
                        </Box>
                      ) : (
                        <LinearProgressBarMonitored data={dataPolygonOverview} />
                      )}
                    </div>
                  </div>
                  <div className="min-w-[450px] flex-[18]">
                    <div className="mb-2">
                      <Text variant="text-16-bold" className="mb-2 flex items-center gap-1 text-darkCustom">
                        Add or Edit Polygons
                      </Text>
                      <Text variant="text-14-light" className="text-darkCustom">
                        Add, remove or edit polygons that are associated to a site. Polygons may be edited in the map
                        below; exported, modified in QGIS or ArcGIS and imported again; or fed through the mobile
                        application.
                      </Text>
                    </div>
                    <div className="mt-8 flex w-[65%] gap-3">
                      <AddDataButton
                        classNameContent="flex-1"
                        openFormModalHandlerAddPolygon={openFormModalHandlerAddPolygon}
                        openFormModalHandlerUploadImages={openFormModalHandlerUploadImages}
                        openFormModalHandlerAddPolygons={openFormModalHandlerAddPolygons}
                      />

                      <Button
                        variant="white-page-admin"
                        className="flex-1"
                        iconProps={{
                          className: "w-4 h-4 group-hover-text-primary-500",
                          name: IconNames.DOWNLOAD_PA
                        }}
                        onClick={() => {
                          setSelectedPolygonsInCheckbox([]);
                          downloadSiteGeoJsonPolygons(record?.uuid ?? "", record?.name ?? "sitePolygons");
                        }}
                      >
                        Download
                      </Button>
                      <Button
                        className="flex-1 px-3"
                        onClick={() => {
                          setSelectedPolygonsInCheckbox([]);
                          openFormModalHandlerSubmitPolygon();
                        }}
                      >
                        <Text variant="text-14-bold" className="text-white">
                          approve polygons
                        </Text>
                      </Button>
                    </div>
                  </div>
                </div>
                <MapContainer
                  record={record}
                  entityData={{
                    name: record?.name,
                    project: record?.projectName ? { name: record.projectName } : undefined
                  }}
                  polygonsData={polygonDataMap}
                  bbox={activeBbox}
                  className="rounded-lg"
                  status={true}
                  setPolygonFromMap={setPolygonFromMap}
                  polygonFromMap={polygonFromMap}
                  showPopups
                  showLegend
                  mapFunctions={mapFunctions}
                  tooltipType="edit"
                  sitePolygonData={sitePolygonData}
                  mediaFiles={mediaFiles}
                  setIsLoadingDelayedJob={props.setIsLoadingDelayedJob}
                  isLoadingDelayedJob={props.isLoadingDelayedJob}
                  setAlertTitle={props.setAlertTitle}
                />
                <SiteAttributeTable
                  setPolygonFromMap={setPolygonFromMap}
                  flyToPolygonBounds={flyToPolygonBounds}
                  openFormModalHandlerConfirmDeletion={openFormModalHandlerConfirmDeletion}
                  setSorting={setSorting}
                  sorting={sorting}
                  paginatedData={paginatedData}
                  allData={sortedData}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  setCurrentPage={setCurrentPage}
                  setPageSize={setPageSize}
                  containerRef={containerRef}
                />
              </Stack>
            </Grid>
            <Grid xs={3} className="pt-9 pr-4 pl-8">
              <PolygonReviewAside
                type={props.type}
                data={transformedSiteDataForList as IPolygonItem[]}
                polygonFromMap={polygonFromMap}
                setPolygonFromMap={setPolygonFromMap}
                mapFunctions={mapFunctions}
                refresh={refetch}
                totalPolygons={total}
                progress={progress}
                siteUuid={record?.uuid}
                isLoading={loading && sitePolygonData.length === 0}
              />
            </Grid>
          </Grid>
        </TabbedShowLayout.Tab>
      </AnrMapOverlayProvider>
    </SitePolygonDataProvider>
  );
};

export default PolygonReviewTab;
