import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { type FC, memo, useCallback, useState } from "react";

import ImagePreview from "@/components/elements/ImageGallery/ImagePreview";
import ImageWithPlaceholder from "@/components/elements/ImageWithPlaceholder/ImageWithPlaceholder";

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

  const openPreview = useCallback(() => setPreviewOpen(true), []);
  const closePreview = useCallback(() => setPreviewOpen(false), []);

  return (
    <Flex padding="0.75rem" direction="column" gap={2} width="16rem">
      <button
        type="button"
        onClick={openPreview}
        className="relative block h-[9rem] w-full cursor-pointer overflow-hidden rounded-md border-0 bg-transparent p-0"
      >
        <ImageWithPlaceholder className="h-full" alt={t("Image not available")} imageUrl={thumbUrl} />
      </button>
      <Text color="neutral.700" textStyle="300">
        {formatPopupDate(createdAt)}
      </Text>
      {previewOpen ? <ImagePreview data={{ uuid, fullImageUrl: thumbUrl }} onCLose={closePreview} /> : null}
    </Flex>
  );
};

export default memo(PopupContentMedia);
