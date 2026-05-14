import { FC } from "react";

import FilePreviewCard from "@/components/elements/FilePreviewCard/FilePreviewCard";
import Text from "@/components/elements/Text/Text";
import List from "@/components/extensive/List/List";
import { UploadedFile } from "@/types/common";
import { downloadFileUrl } from "@/utils/network";

type FilesProps = {
  title?: string;
  files: UploadedFile[];
};

const Files: FC<FilesProps> = ({ files, title }) => (
  <section className="my-10 rounded-lg bg-neutral-150 p-8">
    {title != null && (
      <Text variant="text-heading-300" className="mb-10">
        {title}
      </Text>
    )}
    <List
      className="grid w-full grid-cols-2 gap-5"
      items={files}
      render={file => (
        <FilePreviewCard
          file={file as UploadedFile}
          onDownload={f => {
            if (f.url != null) downloadFileUrl(f.url);
          }}
        />
      )}
    />
  </section>
);

export default Files;
