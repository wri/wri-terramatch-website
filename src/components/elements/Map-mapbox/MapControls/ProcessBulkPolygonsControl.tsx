import { useT } from "@transifex/react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalProcessBulkPolygons from "@/components/extensive/Modal/ModalProcessBulkPolygons";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { SitePolygon } from "@/generated/apiSchemas";

const ProcessBulkPolygonsControl = () => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const context = useSitePolygonData();
  const { selectedPolygonsInCheckbox, setSelectedPolygonsInCheckbox, setShouldRefetchPolygonData } =
    useMapAreaContext();
  const sitePolygonData = context?.sitePolygonData as Array<SitePolygon>;
  const openFormModalHandlerProcessBulkPolygons = (title: string, content: string, buttonLabel: string) => {
    openModal(
      ModalId.DELETE_BULK_POLYGONS,
      <ModalProcessBulkPolygons
        title={t(title)}
        onClose={() => closeModal(ModalId.DELETE_BULK_POLYGONS)}
        content={t(content)}
        primaryButtonText={t(buttonLabel)}
        primaryButtonProps={{
          className: "px-8 py-3",
          variant: "primary",
          onClick: () => {
            closeModal(ModalId.DELETE_BULK_POLYGONS);
          }
        }}
        secondaryButtonText={t("Cancel")}
        secondaryButtonProps={{
          className: "px-8 py-3",
          variant: "white-page-admin",
          onClick: () => closeModal(ModalId.DELETE_BULK_POLYGONS)
        }}
        sitePolygonData={sitePolygonData}
        selectedPolygonsInCheckbox={selectedPolygonsInCheckbox}
        refetch={() => {
          context?.reloadSiteData();
          setShouldRefetchPolygonData(true);
          setSelectedPolygonsInCheckbox([]);
        }}
      />
    );
  };

  const handleOpen = (type: string) => {
    let title = "Delete Polygons";
    let content = "Confirm that the following polygons will be deleted. This operation is not reversible.";
    let buttonLabel = "Delete";
    if (type === "check") {
      title = "Check Polygons";
      content = "Confirm that the following polygons will be checked.";
      buttonLabel = "Check";
    } else if (type === "fix") {
      title = "Fix Polygons";
      content = "Confirm that the following polygons will be fixed.";
      buttonLabel = "Fix";
    }

    openFormModalHandlerProcessBulkPolygons(title, content, buttonLabel);
  };

  return (
    <div className="flex-col items-center gap-1">
      <div className="rounded-lg bg-[#ffffff26] bg-white p-3 text-center text-white">
        <Text variant="text-10" className="text-black">
          {t("Click below to process the selected polygons")}
        </Text>
        <Button
          variant="text"
          className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-red bg-red p-2 hover:border-white"
          onClick={() => handleOpen("delete")}
        >
          {t("Delete")}
        </Button>
        <Button
          variant="text"
          className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-red bg-red p-2 hover:border-white"
          onClick={() => handleOpen("check")}
        >
          {t("Check")}
        </Button>
        <Button
          variant="text"
          className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-red bg-red p-2 hover:border-white"
          onClick={() => handleOpen("fix")}
        >
          {t("Fix")}
        </Button>
      </div>
    </div>
  );
};

export default ProcessBulkPolygonsControl;