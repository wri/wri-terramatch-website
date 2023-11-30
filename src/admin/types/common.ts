/* eslint-disable no-unused-vars */
import { OptionValue } from "@/types/common";

export type Choice = {
  id: string | OptionValue;
  name: string;
};

export enum AdditionalInputTypes {
  TableInput = "tableInput",
  ConditionalInput = "conditional"
}

export type AuditLogEntities = "project" | "site" | "nursery" | "project-reports" | "site-reports" | "nursery-reports";
