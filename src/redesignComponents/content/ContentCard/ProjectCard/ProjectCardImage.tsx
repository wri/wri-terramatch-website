import { Flex, Image } from "@chakra-ui/react";
import { FC } from "react";

import { PhotosIcon } from "@/redesignComponents/foundations/Icons";

export interface ProjectCardImageProps {
  imageUrl?: string | null;
  alt: string;
}

const ProjectCardImage: FC<ProjectCardImageProps> = ({ imageUrl, alt }) => (
  <Flex
    boxSize="5rem"
    flexShrink={0}
    alignItems="center"
    justifyContent="center"
    borderRadius="full"
    bg={imageUrl == null ? "neutral.200" : "neutral.100"}
  >
    {imageUrl == null ? (
      <PhotosIcon boxSize="1rem" color="neutral.500" />
    ) : (
      <Image src={imageUrl} alt={alt} boxSize="4.875rem" borderRadius="full" objectFit="cover" />
    )}
  </Flex>
);

export default ProjectCardImage;
