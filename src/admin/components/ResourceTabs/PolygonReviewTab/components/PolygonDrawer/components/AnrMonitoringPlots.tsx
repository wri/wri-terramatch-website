import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useT } from "@transifex/react";
import { useCallback, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import ModalConfirm from "@/components/extensive/Modal/ModalConfirm";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useModalContext } from "@/context/modal.provider";

const MOCK_HAS_ANR_MONITORING_PLOT_DATA = true;

const AnrMonitoringPlots = ({ polygonUuid }: { polygonUuid: string }) => {
  const t = useT();
  const { openModal, closeModal } = useModalContext();
  const [plotsVisible, setPlotsVisible] = useState(true);

  const openDeleteConfirmModal = useCallback(() => {
    openModal(
      ModalId.CONFIRM_ANR_MONITORING_PLOTS_DELETION,
      <ModalConfirm
        title={t("Delete ANR Monitoring Plots")}
        content={t("Are you sure you want to delete ANR monitoring plots for this polygon? This cannot be undone.")}
        onClose={() => closeModal(ModalId.CONFIRM_ANR_MONITORING_PLOTS_DELETION)}
        onConfirm={() => {
          closeModal(ModalId.CONFIRM_ANR_MONITORING_PLOTS_DELETION);
        }}
      />
    );
  }, [closeModal, openModal, t]);

  if (polygonUuid === "") {
    return (
      <div className="flex flex-col gap-3">
        <Text variant="text-14" className="text-gray-500">
          {t("ANR Monitoring Plots")}
        </Text>
        <Text variant="text-12" className="text-gray-400">
          {t("Select a polygon to view ANR monitoring plots.")}
        </Text>
      </div>
    );
  }

  if (MOCK_HAS_ANR_MONITORING_PLOT_DATA) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Text variant="text-14-semibold" className="text-darkCustom">
            {t("Assisted Natural Regeneration Monitoring Plots")}
          </Text>
          <button
            type="button"
            className="text-darkCustom hover:opacity-70"
            onClick={() => setPlotsVisible(prev => !prev)}
            aria-label={plotsVisible ? t("Hide ANR monitoring plots") : t("Show ANR monitoring plots")}
          >
            {plotsVisible ? <VisibilityOff sx={{ fontSize: 22 }} /> : <Visibility sx={{ fontSize: 22 }} />}
          </button>
        </div>
        <button
          type="button"
          className="flex w-fit items-center gap-2 rounded-md p-1 text-left hover:bg-neutral-200"
          onClick={openDeleteConfirmModal}
        >
          <Icon name={IconNames.TRASH_PA} className="h-5 w-5 text-darkCustom" />
          <Text variant="text-12-bold" className="text-darkCustom">
            {t("Delete ANR Monitoring Plots")}
          </Text>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Text variant="text-14-semibold" className="text-darkCustom">
        {t("Assisted Natural Regeneration Monitoring Plots")}
      </Text>
      <Text variant="text-12" className="text-gray-400">
        {t("Upload ANR Monitoring Plots")}
      </Text>
      <div className="flex justify-end">
        <Button
          className="self-end border-[2.5px] border-primary"
          iconProps={{ name: IconNames.SEND, className: "h-4 w-4" }}
          onClick={() => undefined}
        >
          <Text variant="text-12-bold" className="text-white">
            {t("upload")}
          </Text>
        </Button>
      </div>
    </div>
  );
};

export default AnrMonitoringPlots;
