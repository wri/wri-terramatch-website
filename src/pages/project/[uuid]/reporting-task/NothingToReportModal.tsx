import { useT } from "@transifex/react";
import { FC, useCallback, useMemo } from "react";

import { IconNames } from "@/components/extensive/Icon/Icon";
import Modal from "@/components/extensive/Modal/Modal";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { useFullEntity } from "@/connections/Entity";
import { useModalContext } from "@/context/modal.provider";
import { useRequestSuccess } from "@/hooks/useConnectionUpdate";
import { NothingToReportEntity, TaskReportDto } from "@/pages/project/[uuid]/reporting-task/types";

export type NothingToReportModalProps = {
  entity: NothingToReportEntity;
  uuid: string;
  onSuccess: (report: TaskReportDto) => void;
};

const NothingToReportModal: FC<NothingToReportModalProps> = ({ entity, uuid, onSuccess }) => {
  const [entityLoaded, { data: report, update, isUpdating, updateFailure }] = useFullEntity(entity, uuid);
  const { closeModal } = useModalContext();
  const t = useT();
  const submitNothingToReport = useCallback(() => {
    update({ nothingToReport: true });
    closeModal(ModalId.CONFIRM_UPDATE);
  }, [closeModal, update]);
  const entityName = useMemo(
    () => t(entity === "srpReports" ? "socioeconomic report" : entity.replace("Reports", "").toLowerCase()),
    [entity, t]
  );
  useRequestSuccess(
    isUpdating,
    updateFailure,
    useCallback(() => onSuccess(report as TaskReportDto), [onSuccess, report])
  );

  return !entityLoaded ? null : (
    <Modal
      iconProps={{ name: IconNames.EXCLAMATION_CIRCLE, width: 60, height: 60 }}
      title={t("Are you sure you don't want to provide any updates for this {entity}?", { entity: entityName })}
      content={t(
        "If you choose not to report anything, it will tell WRI that there was no planting done at this restoration {entity}. Are you sure you want to continue? This can't be undone.",
        { entity: entityName }
      )}
      primaryButtonProps={{
        children: t("Nothing to report"),
        onClick: submitNothingToReport
      }}
      secondaryButtonProps={{
        children: t("Cancel"),
        onClick: () => closeModal(ModalId.CONFIRM_UPDATE)
      }}
    />
  );
};

export default NothingToReportModal;
