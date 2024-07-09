import { Stack } from "@mui/material";
import { FC, useEffect, useState } from "react";

import Button from "@/components/elements/Button/Button";
import Text from "@/components/elements/Text/Text";
import ModalAdd from "@/components/extensive/Modal/ModalAdd";
import { useModalContext } from "@/context/modal.provider";
import {
  fetchPostV2TerrafundUploadGeojson,
  fetchPostV2TerrafundUploadKml,
  fetchPostV2TerrafundUploadShapefile
} from "@/generated/apiComponents";
import { FileType, UploadedFile } from "@/types/common";

const validatePolygonFileShow: FC = () => {
  const { openModal, closeModal } = useModalContext();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [saveFlags, setSaveFlags] = useState<boolean>(false);

  useEffect(() => {
    if (files && files.length > 0 && saveFlags) {
      uploadFiles();
      setSaveFlags(false);
    }
  }, [saveFlags]);

  const getFileType = (file: UploadedFile) => {
    const fileType = file?.file_name.split(".").pop()?.toLowerCase();
    if (fileType === "geojson") return "geojson";
    if (fileType === "zip") return "shapefile";
    if (fileType === "kml") return "kml";
    return null;
  };

  const uploadFiles = async () => {
    const uploadPromises = [];

    for (const file of files) {
      const fileToUpload = file.rawFile as File;
      const formData = new FormData();
      const fileType = getFileType(file);
      formData.append("file", fileToUpload);
      let newRequest: any = formData;

      switch (fileType) {
        case "geojson":
          uploadPromises.push(fetchPostV2TerrafundUploadGeojson({ body: newRequest }));
          break;
        case "shapefile":
          uploadPromises.push(fetchPostV2TerrafundUploadShapefile({ body: newRequest }));
          break;
        case "kml":
          uploadPromises.push(fetchPostV2TerrafundUploadKml({ body: newRequest }));
          break;
        default:
          break;
      }
    }

    await Promise.all(uploadPromises);

    closeModal();
  };

  const openFormModalHandlerAddPolygon = () => {
    openModal(
      <ModalAdd
        title="Add Polygons"
        descriptionInput={`Drag and drop a GeoJSON, Shapefile, or KML.`}
        descriptionList={
          <div className="mt-9 flex">
            <Text variant="text-12-bold">TerraMatch upload file:&nbsp;</Text>
            <Text variant="text-12-light">Test polygons</Text>
          </div>
        }
        onClose={closeModal}
        content="Add polygons to test validation."
        primaryButtonText="Save"
        primaryButtonProps={{ className: "px-8 py-3", variant: "primary", onClick: () => setSaveFlags(true) }}
        acceptedTYpes={FileType.ShapeFiles.split(",") as FileType[]}
        setFile={setFiles}
      />
    );
  };
  return (
    <>
      <Stack gap={1} className="pb-6">
        <Text variant="text-36-bold" className="leading-none">
          Test Polygons
        </Text>
      </Stack>
      upload polygon file
      <div className="flex gap-3">
        <Button onClick={openFormModalHandlerAddPolygon} className="px-8 py-3" variant="primary">
          <Text variant="text-14-bold">Upload Polygon File</Text>
        </Button>
      </div>
    </>
  );
};

export default validatePolygonFileShow;
