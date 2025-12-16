import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import { resourceCreator } from "@/connections/util/resourceMutator";
import {
  fundingProgrammeCreate,
  fundingProgrammeDelete,
  fundingProgrammeGet,
  fundingProgrammesIndex
} from "@/generated/v3/entityService/entityServiceComponents";
import { FundingProgrammeDto } from "@/generated/v3/entityService/entityServiceSchemas";

const fundingProgrammeConnection = v3Resource("fundingProgrammes", fundingProgrammeGet)
  .singleResource<FundingProgrammeDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .addProps<{ translated?: boolean }>(({ translated }) => ({ queryParams: { translated: translated } }))
  .isLoading()
  .enabledProp()
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
