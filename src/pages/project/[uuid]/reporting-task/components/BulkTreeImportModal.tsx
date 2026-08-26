import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback } from "react";

import Button from "@/components/elements/Button/Button";
import IconButton from "@/components/elements/IconButton/IconButton";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { ModalBase } from "@/components/extensive/Modal/ModalsBases";
import { useModalContext } from "@/context/modal.provider";
import { treeBulkImportCsvGet } from "@/generated/v3/entityService/entityServiceComponents";
import Log from "@/utils/log";

type BulkTreeImportModalProps = {
  taskUuid: string;
};

const BulkTreeImportModal: FC<BulkTreeImportModalProps> = ({ taskUuid }) => {
  const t = useT();
  const { closeModal } = useModalContext();

  const downloadCsv = useCallback(async () => {
    try {
      await treeBulkImportCsvGet.downloadFile({ pathParams: { uuid: taskUuid } });
    } catch (err) {
      Log.error("Failed to fetch bulk import CSV", err);
    }
  }, [taskUuid]);

  return (
    <ModalBase className="w-[800px] p-0">
      <div className="flex w-full items-center justify-between gap-4 border-b border-neutral-300 bg-neutral-50 p-8">
        <Text variant="text-bold-headline-1000" className="flex-1">
          {t("Bulk Import Site Report Trees")}
        </Text>
        <IconButton
          iconProps={{ name: IconNames.CROSS_CIRCLE, width: 32 }}
          onClick={() => {
            closeModal(ModalId.BULK_TREE_IMPORT);
          }}
        />
      </div>
      <Flex>
        <Button onClick={downloadCsv}>{t("Download Bulk Import CSV")}</Button>
      </Flex>
    </ModalBase>
  );
};

export default BulkTreeImportModal;
