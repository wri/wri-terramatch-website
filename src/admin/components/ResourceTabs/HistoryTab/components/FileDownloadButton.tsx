import { FC } from "react";

import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

interface FileDownloadButtonProps {
  fileName: string;
  onClick?: () => void;
}

const FileDownloadButton: FC<FileDownloadButtonProps> = ({ fileName, src, onClick }) => {
  return (
    <button className="flex items-center gap-2 rounded p-4 shadow-monitored" onClick={onClick}>
      <Icon name={IconNames.FILE} className="h-6 w-6 text-blueCustom-900" />
      <Text variant="text-14-bold" className="w-full truncate text-left text-blueCustom-900">
        {fileName}
      </Text>
      <Icon name={IconNames.DOWNLOAD} className="h-6 w-6 text-blueCustom-900 opacity-60" />
    </button>
  );
};

export default FileDownloadButton;
