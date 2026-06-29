import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { type FC, memo, useCallback, useState } from "react";

import ImagePreview from "@/components/elements/ImageGallery/ImagePreview";
import GalleryImage from "@/redesignComponents/content/Images/GalleryImage/GalleryImage";

type PopupContentMediaProps = {
  uuid: string;
  thumbUrl: string;
  createdAt: string;
};

const formatPopupDate = (iso: string): string =>
  new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

const PopupContentMedia: FC<PopupContentMediaProps> = ({ uuid, thumbUrl, createdAt }) => {
  const t = useT();
  const [previewOpen, setPreviewOpen] = useState(false);

  const closePreview = useCallback(() => setPreviewOpen(false), []);

  return (
    <Flex padding="0.75rem" direction="column" gap={2} width="17rem" cursor="default">
      <GalleryImage alt="Image popup media" className="h-[11.8125rem] w-full" size={"full"} src={thumbUrl} />
      <Text color="neutral.700" textStyle="200">
        {t("Date uploaded")}: {formatPopupDate(createdAt)}
      </Text>
      {previewOpen ? <ImagePreview data={{ uuid, fullImageUrl: thumbUrl }} onCLose={closePreview} /> : null}
    </Flex>
  );
};

export default memo(PopupContentMedia);
