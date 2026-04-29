import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import { resourceCreator, resourceUpdater } from "@/connections/util/resourceMutator";
import {
  fundingProgrammeCreate,
  fundingProgrammeDelete,
  fundingProgrammeExportAll,
  FundingProgrammeExportAllPathParams,
  fundingProgrammeGet,
  fundingProgrammesIndex,
  fundingProgrammeUpdate
} from "@/generated/v3/entityService/entityServiceComponents";
import { FileDownloadDto, FundingProgrammeDto } from "@/generated/v3/entityService/entityServiceSchemas";
import ApiSlice from "@/store/apiSlice";
import { loadConnection } from "@/utils/loadConnection";

const fundingProgrammeConnection = v3Resource("fundingProgrammes", fundingProgrammeGet)
  .singleResource<FundingProgrammeDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .addProps<{ translated?: boolean }>(({ translated }) => ({ queryParams: { translated: translated } }))
  .enabledProp()
  .update(fundingProgrammeUpdate)
  .buildConnection();

const fundingProgrammesConnection = v3Resource("fundingProgrammes", fundingProgrammesIndex)
  .index<FundingProgrammeDto>()
  .addProps<{ translated?: boolean }>(({ translated }) => ({ queryParams: { translated: translated } }))
  .buildConnection();

export const loadFundingProgramme = connectionLoader(fundingProgrammeConnection);
export const loadFundingProgrammes = connectionLoader(fundingProgrammesConnection);
export const deleteFundingProgramme = deleterAsync("fundingProgrammes", fundingProgrammeDelete, uuid => ({
  pathParams: { uuid }
}));

export const useFundingProgramme = connectionHook(fundingProgrammeConnection);
export const useFundingProgrammes = connectionHook(fundingProgrammesConnection);

const createFundingProgrammeConnection = v3Resource("fundingProgrammes", fundingProgrammeCreate)
  .create<FundingProgrammeDto>()
  .buildConnection();
export const createFundingProgramme = resourceCreator(createFundingProgrammeConnection);
export const updateFundingProgramme = resourceUpdater(fundingProgrammeConnection);

const exportAllConnection = v3Resource("fileDownloads", fundingProgrammeExportAll)
  .singleByCustomId<FileDownloadDto, FundingProgrammeExportAllPathParams>(
    pathParams => ({ pathParams }),
    ({ uuid }) => `fundingProgrammeExport|${uuid}`
  )
  .buildConnection();
export const downloadApplicationExport = async (uuid: string) => {
  ApiSlice.pruneCache("fileDownloads", [`fundingProgrammeExport|${uuid}`]);
  return await loadConnection(exportAllConnection, { uuid });
};
