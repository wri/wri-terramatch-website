/* eslint-disable no-unused-vars */
import { OptionValue } from "@/types/common";

export type Choice = {
  id: string | OptionValue;
  name: string;
};

export enum AdditionalInputTypes {
  TableInput = "tableInput"
}
