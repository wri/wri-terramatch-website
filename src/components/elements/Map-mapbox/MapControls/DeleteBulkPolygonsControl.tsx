import { useT } from "@transifex/react";

import { ModalId } from "@/components/extensive/Modal/ModalConst";
import ModalDeleteBulkPolygons from "@/components/extensive/Modal/ModalDeleteBulkPolygons";
import { useMapAreaContext } from "@/context/mapArea.provider";
import { useModalContext } from "@/context/modal.provider";
import { useSitePolygonData } from "@/context/sitePolygon.provider";
import { SitePolygon } from "@/generated/apiSchemas";

import Button from "../../Button/Button";
import Text from "../../Text/Text";

const DeleteBulkPolygonsControl = () => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const context = useSitePolygonData();
  const { selectedPolygonsInCheckbox } = useMapAreaContext();
  const sitePolygonData = context?.sitePolygonData as Array<SitePolygon>;

  const openFormModalHandlerDeleteBulkPolygons = () => {
    openModal(
      ModalId.DELETE_BULK_POLYGONS,
      <ModalDeleteBulkPolygons
        title={t("Delete Polygons")}
        onClose={() => closeModal(ModalId.DELETE_BULK_POLYGONS)}
        content={t("Confirm that the following polygons will be deleted. This operation is not reversible.")}
        primaryButtonText={t("Delete")}
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
        refetch={context?.reloadSiteData}
      />
    );
  };
  return (
    <div className="flex-col items-center gap-1">
      <div className="rounded-lg bg-[#ffffff26] bg-white p-3 text-center text-white">
        <Text variant="text-10" className="text-black">
          {t("Click below to delete the selected polygons")}
        </Text>
        <Button
          variant="text"
          className="text-10-bold my-2 flex w-full justify-center rounded-lg border border-red bg-red p-2 hover:border-white"
          onClick={() => openFormModalHandlerDeleteBulkPolygons()}
        >
          {t("Delete Polygons")}
        </Button>
      </div>
    </div>
  );
};

export default DeleteBulkPolygonsControl;
