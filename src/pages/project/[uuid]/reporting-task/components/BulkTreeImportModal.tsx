import { Flex } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { Dictionary } from "lodash";
import { ChangeEvent, FC, useCallback, useMemo, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { twMerge } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import IconButton from "@/components/elements/IconButton/IconButton";
import { FileCardContent } from "@/components/elements/Inputs/FileInput/FileCardContent";
import { VARIANT_FILE_INPUT_DEFAULT } from "@/components/elements/Inputs/FileInput/FileInputVariants";
import Text from "@/components/elements/Text/Text";
import { IconNames } from "@/components/extensive/Icon/Icon";
import { ModalId } from "@/components/extensive/Modal/ModalConst";
import { ModalBase } from "@/components/extensive/Modal/ModalsBases";
import { useModalContext } from "@/context/modal.provider";
import { treeBulkImportCsvGet, treeBulkImportCsvUpload } from "@/generated/v3/entityService/entityServiceComponents";
import { isTranslatableError } from "@/generated/v3/utils";
import Table, { TableColumn } from "@/redesignComponents/dataDisplay/Table/Table";
import { getErrorMessages } from "@/utils/errors";
import Log from "@/utils/log";
import { parallelRequestHook } from "@/utils/parallelRequestHook";

type BulkTreeImportModalProps = {
  taskUuid: string;
};

const useUploadCsv = parallelRequestHook("treeBulkUploads", treeBulkImportCsvUpload);

type UploadWarning = {
  id: number;
  row?: number;
  message: string;
};

const UPLOAD_WARNINGS: Dictionary<string> = {
  TREE_NAME_MISSING: "Tree Species name missing",
  SITE_NAME_MISSING: "Site name missing",
  AMOUNT_UNSUPPORTED: "Amount value not supported: {amountString}"
};

const BulkTreeImportModal: FC<BulkTreeImportModalProps> = ({ taskUuid }) => {
  const t = useT();
  const { closeModal } = useModalContext();
  const [warnings, setWarnings] = useState<UploadWarning[]>([]);

  const downloadCsv = useCallback(async () => {
    try {
      await treeBulkImportCsvGet.downloadFile({ pathParams: { uuid: taskUuid } });
    } catch (err) {
      Log.error("Failed to fetch bulk import CSV", err);
    }
  }, [taskUuid]);

  const uploadCsv = useUploadCsv({ pathParams: { uuid: taskUuid } });
  const onUploadFile = useCallback(
    (file: File) => {
      setWarnings([]);
      const formData = new FormData();
      formData.append("uploadFile", file);
      uploadCsv(
        { formData },
        {
          onSuccess: ({ data }) => {
            const warnings = data?.attributes?.warnings;
            if (warnings != null && warnings.length > 0) {
              setWarnings(
                warnings.map(({ message, code, row, variables }, index) => {
                  if (UPLOAD_WARNINGS[code] == null) {
                    Log.error("No upload warning code defined", { code, message });
                  }
                  return {
                    id: index,
                    message: t(UPLOAD_WARNINGS[code] ?? message, variables),
                    row
                  };
                })
              );
            }
          },
          onError: error => {
            const message =
              (isTranslatableError(error) ? getErrorMessages(t, error.code, error.variables)?.message : undefined) ??
              error.message;
            setWarnings([{ id: 0, message }]);
          }
        }
      );
    },
    [t, uploadCsv]
  );

  const onSelectFile = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files == null ? null : Array.from(e.target.files)[0];
      if (file != null) {
        onUploadFile(file);
      }
    },
    [onUploadFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files: File[]) => {
      if (files[0] != null) onUploadFile(files[0]);
    }
  });
  const uploadRef = useRef<HTMLInputElement>(null);

  const warningColumns = useMemo<TableColumn[]>(
    () => [
      { key: "row", label: t("Row") },
      { key: "message", label: t("Message") }
    ],
    [t]
  );

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
      <Flex direction="column" align="center" justify="center" gap={4} padding={4}>
        <Button onClick={downloadCsv}>{t("Download Bulk Import CSV")}</Button>
        <div
          {...getRootProps()}
          className={twMerge(isDragActive ? "bg-primary-100" : "bg-white", VARIANT_FILE_INPUT_DEFAULT.container)}
          onClick={() => uploadRef.current?.click()}
        >
          <input
            {...getInputProps()}
            id="upload"
            ref={uploadRef}
            type="file"
            hidden
            onChange={onSelectFile}
            multiple={false}
            accept="text/csv"
          />
          <div className="m-auto flex w-fit items-center justify-center gap-3">
            <FileCardContent
              title={"Upload Bulk Import CSV"}
              subtitle={t("Drag and drop or {browse}", {
                browse: `<span class="underline text-primary">${t("browse your device")}</span>`
              })}
              thumbnailClassName="fill-primary"
              thumbnailContainerClassName="bg-primary-100"
            />
          </div>
        </div>
        {warnings.length > 0 && <Table data={warnings} columns={warningColumns} />}
      </Flex>
    </ModalBase>
  );
};

export default BulkTreeImportModal;
