import Text from "@/components/elements/Text/Text";
import Icon, { IconNames } from "@/components/extensive/Icon/Icon";

interface DownloadMediaItemProps {
  name: string;
  src: string;
}

const DownloadMediaItem = ({ name, src }: DownloadMediaItemProps) => (
  <a href={src} className="flex items-center gap-2 rounded-lg px-4 py-3 shadow-all" download>
    <Icon name={IconNames.IMAGE_FILL} className="h-4 w-4 text-darkCustom-300" />
    <Text variant="text-12-bold" className="leading-none text-blueCustom-900">
      {name}
    </Text>
    <Icon name={IconNames.DOWNLOAD} className="ml-auto h-4 w-4 text-[##667D85]" />
  </a>
);

export default DownloadMediaItem;
