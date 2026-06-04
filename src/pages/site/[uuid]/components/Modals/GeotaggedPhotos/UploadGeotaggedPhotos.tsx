import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import { useT } from "@transifex/react";
import { FC, useCallback, useState } from "react";

import Button from "@/redesignComponents/actions/Buttons/Button/Button";
import ButtonGroup from "@/redesignComponents/actions/Buttons/ButtonGroup/ButtonGroup";
import Modal from "@/redesignComponents/containers/Modal/Modal";
import GalleryImage from "@/redesignComponents/content/Images/GalleryImage/GalleryImage";
import { UploadIcon } from "@/redesignComponents/foundations/Icons";

const ACCEPTED_FORMATS = ".jpg,.jpeg,.png";

export interface UploadGeotaggedPhotosProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mockedFiles = [
  new File(["photo1.jpg"], "photo1.jpg", { type: "image/jpeg" }),
  new File(["photo2.jpg"], "photo2.jpg", { type: "image/jpeg" }),
  new File(["photo3.jpg"], "photo3.jpg", { type: "image/jpeg" }),
  new File(["photo4.jpg"], "photo4.jpg", { type: "image/jpeg" }),
  new File(["photo5.jpg"], "photo5.jpg", { type: "image/jpeg" }),
  new File(["photo6.jpg"], "photo6.jpg", { type: "image/jpeg" }),
  new File(["photo7.jpg"], "photo7.jpg", { type: "image/jpeg" }),
  new File(["photo8.jpg"], "photo8.jpg", { type: "image/jpeg" }),
  new File(["photo9.jpg"], "photo9.jpg", { type: "image/jpeg" }),
  new File(["photo10.jpg"], "photo10.jpg", { type: "image/jpeg" })
];

const UploadGeotaggedPhotos: FC<UploadGeotaggedPhotosProps> = ({ open, onOpenChange }) => {
  const t = useT();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleClose = useCallback(() => {
    onOpenChange(false);
  }, [onOpenChange]);

  const handleFileChange = useCallback(() => {
    setSelectedFiles(mockedFiles as File[]);
  }, []);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      size="medium"
      header={<b className="text-theme-neutral-800">{t("Upload geotagged photos")}</b>}
      content={
        <Box pl={4} w="full">
          {selectedFiles.length > 0 ? (
            <Flex flexDirection="column" gap={3} w="full">
              <Flex justifyContent="space-between" alignItems="center" gap={2} w="full" pr={4}>
                <Text textStyle="300-bold" color="neutral.900" display="flex" gap={0.5}>
                  {selectedFiles.length}
                  <Text textStyle="300" color="neutral.700" as="span">
                    {t("Photos")}
                  </Text>
                </Text>
                <Button
                  variant="borderless"
                  size="small"
                  leftIcon={<UploadIcon />}
                  onClick={() => setSelectedFiles([])}
                >
                  {t("Click to Upload")}
                </Button>
              </Flex>
              <Box overflow="auto" maxW="100%" h="30.5rem" mr={-4} pr={4}>
                <Grid templateColumns="repeat(3, 1fr)" gap={4} w="full">
                  {selectedFiles.map(file => (
                    <Box key={file.name} maxH={"fit-content"} w="full">
                      <GalleryImage
                        alt={file.name}
                        size={"100%"}
                        className="!h-[8.75rem] w-full"
                        src={URL.createObjectURL(file)}
                      />
                      <Text textStyle="300" color="neutral.800" lineClamp={1} mt={1}>
                        {file.name}
                      </Text>
                      <Text textStyle="200" color="neutral.700">
                        X MB
                      </Text>
                    </Box>
                  ))}
                </Grid>
              </Box>
            </Flex>
          ) : (
            <Box pr={4} w="full">
              <input type="file" accept={ACCEPTED_FORMATS} multiple style={{ display: "none" }} />

              <Flex
                flexDirection="column"
                gap={4}
                bg={"neutral.200"}
                justifyContent="center"
                alignItems="center"
                py={4}
                rounded={2}
                transition="background-color 0.15s ease-in-out"
              >
                <Flex justifyContent="center" alignItems="center" flexDirection="column" gap={0}>
                  <Text color="neutral.900" textStyle="400">
                    {t("Drag and drop your files here or")}
                  </Text>
                  <Button leftIcon={<UploadIcon />} variant="borderless" onClick={handleFileChange}>
                    {t("Click to upload")}
                  </Button>
                </Flex>

                <Flex justifyContent="center" alignItems="center" flexDirection="column" gap={0}>
                  <Text textStyle="300" color="neutral.700" display="flex" gap={0.5}>
                    {t("Upload JPG or PNG images")}
                    <Text as="span" textStyle="300-bold" color="neutral.700">
                      {t("with location only")}
                    </Text>
                    {t(" (max ")}
                    <Text as="span" textStyle="300-bold" color="neutral.700">
                      {t("XX MB")}
                    </Text>
                    {t(")")}
                  </Text>
                </Flex>
              </Flex>
            </Box>
          )}
        </Box>
      }
      footer={
        <ButtonGroup
          buttons={[
            {
              id: "cancel",
              variant: "secondary",
              children: t("Cancel"),
              onClick: handleClose
            },
            {
              id: "save",
              children: t("Save"),
              onClick: () => {}
            }
          ]}
        />
      }
    />
  );
};

export default UploadGeotaggedPhotos;
