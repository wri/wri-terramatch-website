import { useState } from "react";
import { When } from "react-if";

import Button from "@/components/elements/Button/Button";
import TextArea from "@/components/elements/Inputs/textArea/TextArea";
import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";
import { usePostV2AuditStatus } from "@/generated/apiComponents";

export interface ComentaryBoxProps {
  name: string;
  lastName: string;
  buttonSendOnBox?: boolean;
  mutate?: any;
  refresh?: any;
  record?: any;
  entity?: string;
  attachmentRefetch?: any;
}

const ComentaryBox = (props: ComentaryBoxProps) => {
  const { name, lastName, buttonSendOnBox, refresh, record, entity } = props;
  const { mutate: upload } = usePostV2AuditStatus();
  const [files, setFiles] = useState<File[]>([]);
  const [comment, setComment] = useState<string>("");
  const [error, setError] = useState<string>("");

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
    body.append("entity_uuid", record?.uuid);
    body.append("status", record?.status);
    body.append("entity", entity as string);
    body.append("comment", comment);
    body.append("type", "comment");
    body.append("attachment", "test");
    files.forEach((element: File, index: number) => {
      body.append(`file[${index}]`, element);
    });
    upload?.(
      {
        //@ts-ignore swagger issue
        body
      },
      {
        onSuccess: () => {
          setComment("");
          setError("");
          setFiles([]);
          props.attachmentRefetch();
          refresh();
        }
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 rounded-3xl border border-grey-750 p-3">
        <div className="flex min-h-[32px] min-w-[32px] items-center justify-center self-start rounded-full bg-primary-500">
          <Text variant="text-14-semibold" className="uppercase text-white">
            {name?.[0]}
            {lastName?.[0]}
          </Text>
        </div>
        <TextArea
          placeholder="Add a comment"
          name=""
          className="max-h-72 !min-h-0 resize-none border-none !p-0 text-xs"
          containerClassName="w-full"
          rows={1}
          onChange={e => setComment(e.target.value)}
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
      {error && <div className="text-red">{error}</div>}
      <When condition={!buttonSendOnBox}>
        <Button className="self-end" iconProps={{ name: IconNames.SEND, className: "h-4 w-4" }} onClick={submitComment}>
          <Text variant="text-12-bold" className="text-white">
            SEND
          </Text>
        </Button>
      </When>
    </div>
  );
};

export default ComentaryBox;
