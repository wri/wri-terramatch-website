import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook } from "@/connections/util/connectionShortcuts";
import {
  aboutSectionGet,
  AboutSectionGetPathParams,
  AboutSectionGetQueryParams
} from "@/generated/v3/entityService/entityServiceComponents";
import { AboutSectionDto } from "@/generated/v3/entityService/entityServiceSchemas";

const aboutSectionConnection = v3Resource("aboutSections", aboutSectionGet)
  .singleByCustomId<AboutSectionDto, Partial<AboutSectionGetPathParams & AboutSectionGetQueryParams>>(
    ({ type, framework }) => (type == null ? undefined : { pathParams: { type }, queryParams: { framework } }),
    ({ type, framework }) => `${type}|${framework ?? ""}`
  )
  .buildConnection();
export const useAboutSection = connectionHook(aboutSectionConnection);
