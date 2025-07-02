import { FC } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

interface FileDownloadButtonProps {
  file: any;
  onClick?: () => void;
}

const FileDownloadButton: FC<FileDownloadButtonProps> = ({ file, onClick }) => {
  return (
    <button className="flex items-center gap-2 rounded p-4 shadow-monitored" onClick={onClick}>
      <Icon name={IconNames.FILE} className="h-6 w-6 text-blueCustom-900" />
      <Text variant="text-14-bold" className="w-full truncate text-left text-blueCustom-900">
        {file?.file_name}
      </Text>
      <a href={file?.url} target="_blank" rel="noopener noreferrer">
        <Icon name={IconNames.DOWNLOAD} className="h-6 w-6 text-blueCustom-900 opacity-60" />
      </a>
    </button>
  );
};

export default FileDownloadButton;
