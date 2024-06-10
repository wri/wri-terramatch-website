import { useT } from "@transifex/react";
import { useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { usePostV2AuditStatus } from "@/generated/apiComponents";

import Notification from "../Notification/Notification";

export interface CommentaryBoxProps {
  name: string;
  lastName: string;
  buttonSendOnBox?: boolean;
  mutate?: any;
  refresh?: any;
  record?: any;
  entity?: string;
}

const CommentaryBox = (props: CommentaryBoxProps) => {
  const { name, lastName, buttonSendOnBox } = props;
  const t = useT();

  const { mutate: sendCommentary } = usePostV2AuditStatus();
  const [files, setFiles] = useState<File[]>([]);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [charCount, setCharCount] = useState<number>(0);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [warning, setWarning] = useState<string>("");

  const validFileTypes = [
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/tiff"
  ];
  const maxFileSize = 10 * 1024 * 1024;
  const maxFiles = 5;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (files.length >= maxFiles) {
        setError("You can upload a maximum of 5 files.");
        return;
      }
      if (!validFileTypes.includes(file?.type)) {
        setError("Invalid file type. Only PDF, XLS, DOC, XLSX, DOCX, JPG, PNG, and TIFF are allowed.");
        return;
      }
      if (file.size > maxFileSize) {
        setError("File size must be less than 10MB.");
        return;
      }
      setFiles(prevFiles => [...prevFiles, file]);
      setError("");
    }
  };
  const submitComment = () => {
    const body = new FormData();
    body.append("auditable_type", props.entity as string);
    body.append("auditable_uuid", props.record?.uuid);
    body.append("status", props.record?.status);
    body.append("comment", comment);
    body.append("type", "comment");
    files.forEach((element: File, index: number) => {
      body.append(`file[${index}]`, element);
    });
    setLoading(true);
    sendCommentary?.(
      {
        //@ts-ignore swagger issue
        body
      },
      {
        onSuccess: () => {
          setShowNotification(true);
          setTimeout(() => {
            setShowNotification(false);
          }, 3000);
          setComment("");
          setError("");
          setFiles([]);
          props.refresh && props.refresh();
          setLoading(false);
        }
      }
    );
  };

  const handleCommentChange = (e: any) => {
    setComment(e.target.value);
    setCharCount(e.target.value.length);
    if (charCount >= 255) {
      setWarning("Your comment exceeds 255 characters.");
    } else {
      setWarning("");
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-3xl border border-grey-750 p-3">
        <div className="flex min-h-[32px] min-w-[32px] items-center justify-center self-start rounded-full bg-primary-500">
          <Text variant="text-14-semibold" className="uppercase text-white">
            {(name && name[0]) ?? ""}
            {(lastName && lastName[0]) ?? ""}
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
        <When condition={buttonSendOnBox}>
          <Button variant="text" iconProps={{ name: IconNames.SEND, className: "h-4 w-4 text-darkCustom" }} />
        </When>
      </div>
      <div className="flex flex-1 justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <When condition={files.length > 0}>
            {...files.map((file: any) => (
              <div
                key={file.name}
                className="flex items-baseline justify-between gap-2 rounded-xl bg-neutral-150 px-2 py-1"
              >
                <Text variant="text-12-light" className="text-nowrap text-darkCustom">
                  {file?.name}
                </Text>
                <button
                  className="bg-transparent p-0 text-darkCustom hover:text-red"
                  onClick={() => {
                    setFiles(files.filter((f: any) => f.name !== file.name));
                  }}
                >
                  <Icon name={IconNames.CLEAR} className="h-2.5 w-2.5 lg:h-3 lg:w-3" />
                </button>
              </div>
            ))}
          </When>
        </div>

        <div className="display-grid">
          {warning && charCount > 255 && <div className="text-right text-xs text-red">{warning}</div>}
          <div className={`text-nowrap text-right text-xs ${charCount > 255 ? "text-red" : "text-grey-500"}`}>
            {charCount}/255 characters
          </div>
        </div>
      </div>

      {error && <div className="text-red">{error}</div>}
      <When condition={!buttonSendOnBox}>
        <Button
          className="self-end"
          disabled={loading}
          iconProps={{ name: IconNames.SEND, className: "h-4 w-4" }}
          onClick={submitComment}
        >
          <Text variant="text-12-bold" className="text-white">
            {t("SEND")}
          </Text>
          {loading && <Icon name={IconNames.ELLIPSE_POLYGON} className={"h-6 w-6 animate-spin"} />}
        </Button>
      </When>
      <Notification
        title="Success!"
        message="Your comment was just added!"
        type="success"
        open={showNotification}
      ></Notification>
    </div>
  );
};

export default CommentaryBox;
