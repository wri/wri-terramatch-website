import { Flex, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { type FC, useState } from "react";

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

  return (
    <Flex padding="0.75rem" direction="column" gap={2} width="16rem">
      <button
        type="button"
        onClick={() => setPreviewOpen(true)}
        className="relative block h-[9rem] w-full cursor-pointer overflow-hidden rounded-md border-0 bg-transparent p-0"
      >
        <ImageWithPlaceholder className="h-full" alt={t("Image not available")} imageUrl={thumbUrl} />
      </button>
      <Text color="neutral.700" textStyle="300">
        {formatPopupDate(createdAt)}
      </Text>
      <ImagePreview
        data={{ uuid, fullImageUrl: thumbUrl }}
        onCLose={() => setPreviewOpen(false)}
        WrapperClassName={previewOpen ? "" : "hidden"}
      />
    </Flex>
  );
};

export default PopupContentMedia;
