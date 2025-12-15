import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { submissionGet } from "@/generated/v3/entityService/entityServiceComponents";
import { SubmissionDto } from "@/generated/v3/entityService/entityServiceSchemas";

const formSubmissionConnection = v3Resource("submissions", submissionGet)
  .singleResource<SubmissionDto>(({ id }) => (id == null ? undefined : { pathParams: { uuid: id } }))
  .isLoading()
  .enabledProp()
  .buildConnection();

export const loadSubmission = connectionLoader(formSubmissionConnection);
export const useSubmission = connectionHook(formSubmissionConnection);
