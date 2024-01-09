import { When } from "react-if";

import FilePreviewCard from "@/components/elements/FilePreviewCard/FilePreviewCard";
import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";
import { V2FileRead } from "@/generated/apiSchemas";
import { UploadedFile } from "@/types/common";
import { downloadFile } from "@/utils/network";

type FilesProps = {
  title?: string;
  files: V2FileRead[];
};

const Files = ({ files, title }: FilesProps) => {
  return (
    <section className="my-10 bg-neutral-150 p-8">
      <When condition={!!title}>
        <Text variant="text-heading-300" className="mb-10">
          {title}
        </Text>
      </When>
      <List
        className="grid w-full grid-cols-2 gap-5"
        items={files}
        render={file => <FilePreviewCard file={file as UploadedFile} onDownload={f => downloadFile(f.url)} />}
      />
    </section>
  );
};

export default Files;
