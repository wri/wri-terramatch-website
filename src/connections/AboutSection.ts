import { DataConnection, v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionLoader } from "@/connections/util/connectionShortcuts";
import { deleterAsync } from "@/connections/util/resourceDeleter";
import { resourceCreator, resourceUpdater } from "@/connections/util/resourceMutator";
import { Framework } from "@/context/framework.provider";
import {
  aboutSectionCreate,
  aboutSectionDelete,
  aboutSectionGet,
  aboutSectionIndex,
  AboutSectionIndexQueryParams,
  aboutSectionPushTranslations,
  aboutSectionUpdate
} from "@/generated/v3/entityService/entityServiceComponents";
import { AboutSectionDto, FormTranslationDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import { Connected, Filter } from "@/types/connection";

const aboutSectionIndexConnection = v3Resource("aboutSections", aboutSectionIndex)
  .index<AboutSectionDto>()
  .pagination()
  .filter<Filter<AboutSectionIndexQueryParams>>()
  .enabledProp()
  .buildConnection();

export const loadAboutSections = connectionLoader(aboutSectionIndexConnection);

type FindAboutSectionProps = {
  type: NonNullable<AboutSectionIndexQueryParams["type"]>;
  framework: NonNullable<AboutSectionIndexQueryParams["framework"]> | Framework.UNDEFINED;
};
export const useAboutSection = ({
  type,
  framework
}: FindAboutSectionProps): Connected<DataConnection<AboutSectionDto>> => {
  const enabled = framework !== Framework.UNDEFINED;
  const [loaded, { data }] = useConnection(aboutSectionIndexConnection, {
    enabled,
    filter: enabled ? { type, framework } : undefined
  });
  return loaded ? [true, { data: data?.[0] }] : [false, {}];
};

const aboutSectionConnection = v3Resource("aboutSections", aboutSectionGet)
  .singleResource<AboutSectionDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .enabledProp()
  .update(aboutSectionUpdate)
  .buildConnection();
export const loadAboutSection = connectionLoader(aboutSectionConnection);
export const updateAboutSection = resourceUpdater(aboutSectionConnection);
export const deleteAboutSection = deleterAsync("aboutSections", aboutSectionDelete, uuid => ({ pathParams: { uuid } }));

const formTranslationConnection = v3Resource("formTranslations", aboutSectionPushTranslations)
  .singleResource<FormTranslationDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .buildConnection();
export const pushAboutSectionTranslations = connectionLoader(formTranslationConnection);

const createAboutSectionConnection = v3Resource("aboutSections", aboutSectionCreate)
  .create<AboutSectionDto>()
  .buildConnection();
export const createAboutSection = resourceCreator(createAboutSectionConnection);
