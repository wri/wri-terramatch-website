import { isEntityReport } from "@/helpers/entity";
import { EntityName } from "@/types/common";

/** Reports with status "due" have never been saved; defer validation until the user returns. */
export const shouldDeferReportValidation = (entityName: EntityName, status?: string | null) =>
  isEntityReport(entityName) && status === "due";
