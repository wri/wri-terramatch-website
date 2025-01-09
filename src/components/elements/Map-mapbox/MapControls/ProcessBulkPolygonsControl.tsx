import { useT } from "@transifex/react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalFixOverlaps from "@/components/extensive/Modal/ModalFixOverlaps";
import ModalProcessBulkPolygons from "@/components/extensive/Modal/ModalProcessBulkPolygons";
import { useLoading } from "@/context/loaderAdmin.provider";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useNotificationContext } from "@/context/notification.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import {
  useDeleteV2TerrafundProjectPolygons,
  usePostV2TerrafundClipPolygonsPolygons,
  usePostV2TerrafundValidationPolygons
} from "@/generated/apiComponents";
import { SitePolygon } from "@/generated/apiSchemas";
import ApiSlice from "@/store/apiSlice";

const ProcessBulkPolygonsControl = ({
  entityData,
  setIsLoadingDelayedJob,
  isLoadingDelayedJob,
  setAlertTitle
}: {
  entityData: any;
  setIsLoadingDelayedJob?: (value: boolean) => void;
  isLoadingDelayedJob?: boolean;
  setAlertTitle?: (value: string) => void;
}) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const context = useSitePolygonData();
  const { mutate: checkPolygons } = usePostV2TerrafundValidationPolygons();
  const {
    selectedPolygonsInCheckbox,
    setSelectedPolygonsInCheckbox,
    setShouldRefetchPolygonData,
    setShouldRefetchValidation
  } = useMapAreaContext();
  const refetchData = () => {
    context?.reloadSiteData();
    setShouldRefetchValidation(true);
    setShouldRefetchPolygonData(true);
    setSelectedPolygonsInCheckbox([]);
  };
  const { showLoader, hideLoader } = useLoading();
  const { openNotification } = useNotificationContext();
  const { mutate: fixPolygons } = usePostV2TerrafundClipPolygonsPolygons();
  const sitePolygonData = context?.sitePolygonData as Array<SitePolygon>;
  const { mutate: deletePolygons } = useDeleteV2TerrafundProjectPolygons();

  const openFormModalHandlerProcessBulkPolygons = () => {
    openModal(
      ModalId.DELETE_BULK_POLYGONS,
      <ModalProcessBulkPolygons
        title={t("Delete Polygons")}
        onClose={() => closeModal(ModalId.DELETE_BULK_POLYGONS)}
        content={t("Confirm that the following polygons will be deleted. This operation is not reversible.")}
        primaryButtonText={t("Delete")}
        onClick={(currentSelectedUuids: any) => {
          showLoader();
          closeModal(ModalId.DELETE_BULK_POLYGONS);
          deletePolygons(
            {
              body: {
                uuids: currentSelectedUuids
              }
            },
            {
              onSuccess: () => {
                refetchData();
                hideLoader();
                openNotification("success", t("Success!"), t("Polygons deleted successfully"));
              },
              onError: () => {
                hideLoader();
                openNotification("error", t("Error!"), t("Failed to delete polygons"));
              }
            }
          );
        }}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary"
        }}
        secondaryButtonText={t("Cancel")}
        secondaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => closeModal(ModalId.DELETE_BULK_POLYGONS)
        }}
        sitePolygonData={sitePolygonData}
        selectedPolygonsInCheckbox={selectedPolygonsInCheckbox}
      />
    );
  };
  const openFormModalHandlerSubmitPolygon = (selectedUUIDs: string[]) => {
    openModal(
      ModalId.FIX_POLYGONS,
      <ModalFixOverlaps
        title={t("Fix Polygons")}
        site={entityData}
        onClose={() => closeModal(ModalId.FIX_POLYGONS)}
        content={t(
          "The following polygons have one or more failed criteria, for which an automated solution may be applied. Click 'Fix Polygons' to correct the issue as a new version."
        )}
        primaryButtonText={t("Fix Polygons")}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            closeModal(ModalId.FIX_POLYGONS);
            setIsLoadingDelayedJob?.(true);
            setAlertTitle?.("Fix Polygons");
            fixPolygons(
              {
                body: {
                  uuids: selectedUUIDs,
                  entity_uuid: entityData?.uuid,
                  entity_type: "sites"
                }
              },
              {
                onSuccess: response => {
                  const processedNames = response?.processed?.map(item => item.poly_name).join(", ");

                  setIsLoadingDelayedJob?.(false);
                  ApiSlice.addTotalContent(0);
                  ApiSlice.addProgressContent(0);
                  ApiSlice.addProgressMessage("");
                  if (processedNames) {
                    openNotification(
                      "success",
                      t("Success!"),
                      t(`Polygons fixed successfully. Fixed: ${processedNames}`)
                    );
                  } else {
                    openNotification("warning", t("Warning"), t("No polygons were fixed."));
                  }
                  refetchData?.();
                },
                onError: () => {
                  hideLoader();
                  setIsLoadingDelayedJob?.(false);
                  if (ApiSlice.apiDataStore.abort_delayed_job) {
                    openNotification(
                      "warning",
                      t("The Fix Polygons processing was cancelled."),
                      t("You can try again later.")
                    );
                    ApiSlice.abortDelayedJob(false);
                    ApiSlice.addTotalContent(0);
                    ApiSlice.addProgressContent(0);
                    ApiSlice.addProgressMessage("");
                  } else {
                    openNotification("error", t("Error!"), t("Failed to fix polygons"));
                  }
                }
              }
            );
          }
        }}
        secondaryButtonText={t("Cancel")}
        secondaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => closeModal(ModalId.FIX_POLYGONS)
        }}
        selectedUUIDs={selectedUUIDs}
      />
    );
  };
  const runCheckPolygonsSelected = (selectedUUIDs: string[]) => {
    checkPolygons(
      {
        body: {
          uuids: selectedUUIDs,
          entity_uuid: entityData?.uuid,
          entity_type: "sites"
        }
      },
      {
        onSuccess: () => {
          refetchData?.();
          openNotification("success", t("Success!"), t("Polygons checked successfully"));
          hideLoader();
          setIsLoadingDelayedJob?.(false);
          ApiSlice.addTotalContent(0);
          ApiSlice.addProgressContent(0);
          ApiSlice.addProgressMessage("");
        },
        onError: () => {
          hideLoader();
          setIsLoadingDelayedJob?.(false);
          if (ApiSlice.apiDataStore.abort_delayed_job) {
            openNotification(
              "warning",
              t("The Check Polygons processing was cancelled."),
              t("You can try again later.")
            );
            ApiSlice.abortDelayedJob(false);
            ApiSlice.addTotalContent(0);
            ApiSlice.addProgressContent(0);
            ApiSlice.addProgressMessage("");
          } else {
            openNotification("error", t("Error!"), t("Failed to check polygons"));
          }
        }
      }
    );
  };

  const handleOpen = (type: "check" | "fix" | "delete") => {
    const initialSelection = sitePolygonData.map((polygon: any) =>
      selectedPolygonsInCheckbox.includes(polygon.poly_id)
    );
    const selectedUUIDs: string[] = sitePolygonData
      .filter((_, index) => initialSelection[index])
      .map((polygon: SitePolygon) => polygon.poly_id || "");
    if (type === "check") {
      setIsLoadingDelayedJob?.(true);
      setAlertTitle?.("Check Polygons");
      runCheckPolygonsSelected(selectedUUIDs);
    } else if (type === "fix") {
      openFormModalHandlerSubmitPolygon(selectedUUIDs);
    } else {
      openFormModalHandlerProcessBulkPolygons();
    }
  };

  return (
    <div className="w-[320px] flex-col items-center gap-1 lg:w-[390px]">
      <div className="rounded-lg bg-[#ffffff26]  p-3 text-center text-white backdrop-blur-md">
        <Text variant="text-10-bold" className="text-white">
          {t("Click below to process the selected polygons")}
        </Text>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="text"
            className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-red bg-red p-2 hover:border-white
              disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => handleOpen("delete")}
            disabled={isLoadingDelayedJob}
          >
            {t("Delete")}
          </Button>
          <Button
            variant="text"
            className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-tertiary-600 bg-tertiary-600 p-2 hover:border-white
             disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => handleOpen("check")}
            disabled={isLoadingDelayedJob}
          >
            {t("Check")}
          </Button>
          <Button
            variant="text"
            className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-white bg-white p-2 text-darkCustom-100 hover:border-primary
            disabled:cursor-not-allowed disabled:opacity-60"
            onClick={() => handleOpen("fix")}
            disabled={isLoadingDelayedJob}
          >
            {t("Fix")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProcessBulkPolygonsControl;
