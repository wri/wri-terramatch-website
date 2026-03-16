import { Box, Flex } from "@chakra-ui/react";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useMedia, useMedias } from "@/connections/EntityAssociation";
import { useGadmOptions } from "@/connections/Gadm";
import { deleteMedia, fileUploadOptions, prepareFileForUpload, updateMedia, useUploadFile } from "@/connections/Media";
import { useUserAssociations } from "@/connections/UserAssociation";
import { ProjectFullDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useFiles } from "@/hooks/useFiles";
import { getPlantingStatus } from "@/pages/project/[uuid]/tabs/constants/Detail.constants";
import ModalSelectGalleryImages from "@/redesignComponents/containers/Modal/ModalSelectGalleryImages";
import ModalUploadImage from "@/redesignComponents/containers/Modal/ModalUploadImage";
import {
  countryCodeToFlag,
  formatMonthYear
} from "@/redesignComponents/content/headers/PageHeaders/ProjectHeader/projectHeader.utils";
import { ProfileImage } from "@/redesignComponents/content/Images/ProfileImage/ProfileImage";
import { PhotoLibraryIcon, UploadIcon } from "@/redesignComponents/foundations/Icons";
import ApiSlice from "@/store/apiSlice";
import { FileType, UploadedFile } from "@/types/common";
import { HookProps } from "@/types/connection";
import { formatOptionsList } from "@/utils/options";

import ProjectInfo from "../components/ProjectInfo";
import TeamSection from "../components/TeamSection";
import { IMAGE_CONTAINER_CLASSES, IMAGE_SIZE } from "../constants/projectHeader";

export interface ProjectHeaderProps {
  project: ProjectFullDto;
  onAddTeamClick: () => void;
  gotoTeamMembers: () => void;
}

const ProjectHeader: FC<ProjectHeaderProps> = ({ project, onAddTeamClick, gotoTeamMembers }) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryPagination, setGalleryPagination] = useState({ page: 1, pageSize: 20 });
  const [galleryImages, setGalleryImages] = useState<
    { uuid: string; src: string; alt: string; url: string; name: string }[]
  >([]);
  const [isLoadingMoreGallery, setIsLoadingMoreGallery] = useState(false);
  const [selectedCoverUrl, setSelectedCoverUrl] = useState<string | undefined>(undefined);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<{
    uuid: string;
    src: string;
    alt: string;
    url: string;
    name: string;
  } | null>(null);
  const [coverScale, setCoverScale] = useState<number | undefined>(undefined);
  const [coverMediaUuid, setCoverMediaUuid] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [, { data: associatedUsers }] = useUserAssociations({
    uuid: project.uuid,
    filter: { isManager: false },
    model: "projects"
  });

  const teamMembers = useMemo(
    () =>
      (associatedUsers ?? []).slice(0, 5).map(user => {
        const name = `${user.fullName ?? ""}`.trim();
        return { name, avatar: { name } };
      }),
    [associatedUsers]
  );

  const countryOptions = useGadmOptions({ level: 0 });
  const [, { data: coverImage }] = useMedia({
    entity: "projects",
    uuid: project.uuid ?? null,
    filter: { isCover: true }
  });

  useEffect(() => {
    if (coverImage?.uuid) {
      setCoverMediaUuid(coverImage.uuid);
    }
  }, [coverImage?.uuid]);

  const { files, addFile, removeFile } = useFiles(true);
  const uploadFile = useUploadFile({
    pathParams: { entity: "projects", collection: "media", uuid: project.uuid }
  });

  const [isGalleryLoaded, { data: mediaList, indexTotal }] = useMedias(
    useMemo<HookProps<typeof useMedias>>(
      () => ({
        entity: "projects",
        uuid: project.uuid,
        pageNumber: galleryPagination.page,
        pageSize: galleryPagination.pageSize,
        sortField: "createdAt",
        sortDirection: "DESC"
      }),
      [project.uuid, galleryPagination.page, galleryPagination.pageSize]
    )
  );

  useEffect(() => {
    const rawScale = (coverImage as any)?.profileImageScale;

    if (coverScale != null) return;

    if (rawScale == null) {
      if (coverImage) {
        setCoverScale(1);
      }
      return;
    }

    const numericScale =
      typeof rawScale === "string" ? parseFloat(rawScale) : typeof rawScale === "number" ? rawScale : undefined;

    if (numericScale != null && !Number.isNaN(numericScale)) {
      setCoverScale(numericScale);
    }
  }, [coverImage, coverScale]);

  useEffect(() => {
    if (!isGalleryLoaded || mediaList == null) return;

    setGalleryImages(prev => {
      if (galleryPagination.page === 1) {
        return mediaList.map(img => ({
          uuid: img.uuid,
          src: img.url!,
          alt: img.name!,
          url: img.url!,
          name: img.name!
        }));
      }

      const existingIds = new Set(prev.map(img => img.uuid));
      const newOnes = mediaList
        .filter(img => !existingIds.has(img.uuid))
        .map(img => ({ uuid: img.uuid, src: img.url!, alt: img.name!, url: img.url!, name: img.name! }));
      return [...prev, ...newOnes];
    });

    setIsLoadingMoreGallery(false);
  }, [isGalleryLoaded, mediaList, galleryPagination.page]);

  const hasMoreGallery = useMemo(() => {
    if (indexTotal == null) return false;
    return galleryImages.length < indexTotal;
  }, [galleryImages.length, indexTotal]);

  const handleLoadMoreGallery = () => {
    if (!hasMoreGallery || isLoadingMoreGallery) return;
    setIsLoadingMoreGallery(true);
    setGalleryPagination(prev => ({ ...prev, page: prev.page + 1 }));
  };

  const [open, setOpen] = useState(false);

  const handleUploadProfileImage = useCallback(
    async (file: File, scale: number) => {
      const fileObject: Partial<UploadedFile> = {
        collectionName: "media",
        size: file.size,
        fileName: file.name,
        mimeType: file.type,
        rawFile: file,
        isCover: true,
        profileImageScale: scale
      };

      addFile(fileObject);

      uploadFile(
        await prepareFileForUpload(file, true, true, scale),
        fileUploadOptions(file, "media", {
          onSuccess: successFile => {
            const updated: UploadedFile = {
              ...(successFile as UploadedFile),
              isCover: true,
              profileImageScale: scale
            };
            addFile(updated);
            setSelectedCoverUrl(updated.url ?? undefined);
            setCoverScale(scale);
            setCoverMediaUuid(updated.uuid);
          },
          onError: errorFile => {
            addFile(errorFile);
          }
        })
      );
    },
    [addFile, uploadFile]
  );

  const handleRemoveProfileImage = useCallback(async () => {
    const file = files?.[0];
    const uuidToDelete = coverMediaUuid ?? coverImage?.uuid ?? file?.uuid;

    if (uuidToDelete == null) return;

    await deleteMedia(uuidToDelete);

    if (file != null) {
      removeFile(file);
    }

    setSelectedCoverUrl(undefined);
    setCoverScale(undefined);
    setCoverMediaUuid(undefined);
    ApiSlice.pruneCache("media", [uuidToDelete]);
  }, [files, removeFile, coverMediaUuid, coverImage?.uuid]);

  const galleryImageItems = useMemo(() => {
    return galleryImages?.map(media => {
      return { uuid: media.uuid, src: media.url!, alt: media.alt!, url: media.url!, name: media.name! };
    });
  }, [galleryImages]);

  const handleSelectGalleryImage = (image: { uuid: string; src: string; alt: string; url: string; name: string }) => {
    const isInitialAddMode = selectedCoverUrl == null && coverImage?.uuid == null;

    if (isInitialAddMode) {
      void handleConfirmGalleryImage(image, 1);
      setIsGalleryOpen(false);
      return;
    }

    setSelectedGalleryImage(image);
    setIsGalleryOpen(false);
  };

  const handleConfirmGalleryImage = useCallback(
    async (image: { uuid: string; src: string; alt: string; url: string; name: string }, scale: number) => {
      await updateMedia(
        {
          isCover: true,
          profileImageScale: scale
        },
        { id: image.uuid }
      );
      setSelectedCoverUrl(image.url);
      setSelectedGalleryImage(null);
      setCoverScale(scale);
      setCoverMediaUuid(image.uuid);
    },
    []
  );

  const handleCloseUploadModal = () => {
    setOpen(false);
    setSelectedGalleryImage(null);
  };

  return (
    <Box display="flex" gap={4} px={6} py={5} justifyContent="space-between" background="secondary.neutral">
      <Flex gap={5}>
        <div className={IMAGE_CONTAINER_CLASSES}>
          <ProfileImage
            size={IMAGE_SIZE}
            alt={project.name ?? ""}
            isAdd={selectedCoverUrl == null && coverImage?.uuid == null}
            onClickEdit={() => setOpen(true)}
            src={selectedCoverUrl ?? coverImage?.thumbUrl!}
            scale={coverScale}
            menuItems={[
              {
                label: "Select from Gallery",
                value: "gallery",
                startIcon: <PhotoLibraryIcon boxSize={4} color="neutral.700" />,
                onClick: () => setIsGalleryOpen(true)
              },
              {
                label: "Upload",
                value: "upload",
                startIcon: <UploadIcon boxSize={4} color="neutral.700" />,
                onClick: () => fileInputRef.current?.click()
              }
            ]}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept={FileType.Image}
            className="hidden"
            onChange={event => {
              const file = event.target.files?.[0];
              if (file == null) return;
              void handleUploadProfileImage(file, 1);
              event.target.value = "";
            }}
          />
          <ModalUploadImage
            open={open}
            onClose={handleCloseUploadModal}
            imgSrc={selectedCoverUrl ?? coverImage?.thumbUrl!}
            mediaUuid={coverMediaUuid}
            onOpenModalImageGallery={setIsGalleryOpen}
            onUploadFile={handleUploadProfileImage}
            onRemoveFile={handleRemoveProfileImage}
            scale={coverScale}
            selectedGalleryImage={selectedGalleryImage}
            onConfirmGalleryImage={handleConfirmGalleryImage}
            onUpdateExistingScale={setCoverScale}
          />
          {isGalleryOpen && (
            <ModalSelectGalleryImages
              open={isGalleryOpen}
              onClose={() => setIsGalleryOpen(false)}
              images={galleryImageItems}
              hasMore={hasMoreGallery}
              isLoading={(!isGalleryLoaded && galleryPagination.page === 1) || isLoadingMoreGallery}
              onLoadMore={handleLoadMoreGallery}
              onSelectImage={handleSelectGalleryImage}
            />
          )}
        </div>
        <ProjectInfo
          project={project}
          title={project.name ?? "-"}
          tag={{ state: getPlantingStatus(project?.plantingStatus!) }}
          organization={project.organisationName ?? "-"}
          country={formatOptionsList(countryOptions ?? [], project.country ?? [])}
          startDate={formatMonthYear(project.plantingStartDate)}
          endDate={formatMonthYear(project.plantingEndDate)}
          description={project.description ?? undefined}
          countryFlag={countryCodeToFlag(project.country)}
        />
      </Flex>

      <TeamSection team={teamMembers} onAddTeamClick={onAddTeamClick} gotoTeamMembers={gotoTeamMembers} />
    </Box>
  );
};

export default ProjectHeader;
