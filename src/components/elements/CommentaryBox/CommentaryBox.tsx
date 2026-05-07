import { useT } from "@transifex/react";
import { FC, useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";

import Button from "@/components/elements/Button/Button";
import { IButtonProps } from "@/components/elements/Button/Button";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { AuditStatusEntityType, useCreateAuditStatus } from "@/connections/AuditStatus";
import { prepareFileForUpload } from "@/connections/Media";
import { useNotificationContext } from "@/context/notification.provider";
import { uploadFile } from "@/generated/v3/entityService/entityServiceComponents";
import { AuditStatusDto } from "@/generated/v3/entityService/entityServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import Log from "@/utils/log";

export type CommentaryBoxProps = {
  name: string;
  lastName: string;
  buttonSendOnBox?: boolean;
  mutate?: any;
  refresh?: () => void;
  record?: any;
  entity?: AuditStatusEntityType;
  buttonProps?: IButtonProps;
};

const VALID_FILE_TYPES = [
  "application/pdf",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
  "image/tiff"
];
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_FILES = 5;

const CommentaryBox: FC<CommentaryBoxProps> = props => {
  const { name, lastName, buttonSendOnBox, buttonProps } = props;
  const t = useT();

  const onSuccess = async (createdAuditStatus: AuditStatusDto) => {
    try {
      const uuid = createdAuditStatus.uuid;
      if (files.length > 0) {
        await Promise.all(
          files.map(async file =>
            uploadFile.fetchParallel({
              pathParams: { entity: "auditStatuses", collection: "attachments", uuid },
              body: { data: { type: "media", attributes: await prepareFileForUpload(file) } }
            })
          )
        );
      }
      openNotification("success", "Success!", "Your comment was just added!");
      setComment("");
      setError("");
      setFiles([]);
      ApiSlice.pruneCache("auditStatuses");
      props.refresh?.();
    } catch (error) {
      openNotification("error", "Error!", "Failed to upload files. Your comment was added but files may be missing.");
      Log.error("Error uploading files after comment creation", error);
    } finally {
      setLoading(false);
    }
  };

  const { create: sendCommentary, isCreating } = useCreateAuditStatus(
    {
      entity: props.entity ?? "projects",
      uuid: props.record?.uuid ?? ""
    },
    onSuccess,
    "Failed to add comment. Please try again."
  );

  const [files, setFiles] = useState<File[]>([]);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string>("");
  const { openNotification } = useNotificationContext();
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0];
        if (files.length >= MAX_FILES) {
          setError("You can upload a maximum of 5 files.");
          return;
        }
        if (!VALID_FILE_TYPES.includes(file?.type)) {
          setError("Invalid file type. Only PDF, XLS, DOC, XLSX, DOCX, JPG, PNG, and TIFF are allowed.");
          return;
        }
        if (file.size > MAX_FILE_SIZE) {
          setError("File size must be less than 10MB.");
          return;
        }
        setFiles(prevFiles => [...prevFiles, file]);
        setError("");
      }
    },
    [files.length]
  );

  const submitComment = useCallback(() => {
    if (props.entity == null || props.record?.uuid == null) {
      setError("Missing required information. Cannot submit comment.");
      return;
    }

    setLoading(true);
    sendCommentary({
      type: "comment",
      comment: comment,
      status: props.record?.status ?? null
    });
  }, [comment, props.entity, props.record?.status, props.record?.uuid, sendCommentary]);

  const handleCommentChange = useCallback((e: any) => {
    setComment(e.target.value);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-3xl border border-grey-750 p-3">
        <div className="flex min-h-[32px] min-w-[32px] items-center justify-center self-start rounded-full bg-primary-500">
          <Text variant="text-14-semibold" className="uppercase text-white">
            {name?.[0] ?? ""}
            {lastName?.[0] ?? ""}
          </Text>
        </div>
        <TextArea
          placeholder="Add a comment"
          name=""
          className="max-h-72 !min-h-0 resize-none border-none !p-0 text-xs"
          containerClassName="w-full"
          rows={1}
          onChange={e => handleCommentChange(e)}
          value={comment}
        />
        <label htmlFor="input-files" className="cursor-pointer">
          <input
            type="file"
            id="input-files"
            className="absolute z-[-1] h-[0.1px] w-[0.1px] overflow-hidden opacity-0"
            onChange={e => {
              if (e.target.files) {
                handleFileChange(e);
              }
            }}
          />
          <Icon name={IconNames.PAPER_CLIP} className="h-4 w-4" />
        </label>
        {buttonSendOnBox && (
          <Button variant="text" iconProps={{ name: IconNames.SEND, className: "h-4 w-4 text-darkCustom" }} />
        )}
      </div>
      <div className="flex flex-1 justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {files.map(file => (
            <div
              key={file.name}
              className="flex items-baseline justify-between gap-2 rounded-xl bg-neutral-150 px-2 py-1"
            >
              <Text variant="text-12-light" className="text-nowrap text-darkCustom">
                {file.name}
              </Text>
              <button
                className="bg-transparent p-0 text-darkCustom hover:text-red"
                onClick={() => {
                  setFiles(files.filter(f => f.name !== file.name));
                }}
              >
                <Icon name={IconNames.CLEAR} className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {error && <div className="text-red">{error}</div>}
      {!buttonSendOnBox && (
        <Button
          className={twMerge("self-end border-[2.5px] border-primary", buttonProps?.className)}
          disabled={loading || isCreating}
          iconProps={buttonProps?.iconProps ?? { name: IconNames.SEND, className: "h-4 w-4" }}
          onClick={submitComment}
          {...buttonProps}
        >
          <Text variant="text-12-bold" className="text-white">
            {buttonProps?.children ?? t("SEND")}
          </Text>
          {(loading || isCreating) && <Icon name={IconNames.ELLIPSE_POLYGON} className={"h-6 w-6 animate-spin"} />}
        </Button>
      )}
    </div>
  );
};

export default CommentaryBox;
