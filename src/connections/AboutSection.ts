import { DataConnection, v3Resource } from "@/connections/util/apiConnectionFactory";
import { Framework } from "@/context/framework.provider";
import { aboutSectionIndex, AboutSectionIndexQueryParams } from "@/generated/v3/entityService/entityServiceComponents";
import { AboutSectionDto } from "@/generated/v3/entityService/entityServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import { Connected, Filter } from "@/types/connection";

const aboutSectionIndexConnection = v3Resource("aboutSections", aboutSectionIndex)
  .index<AboutSectionDto>()
  .pagination()
  .filter<Filter<AboutSectionIndexQueryParams>>()
  .enabledProp()
  .buildConnection();

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
