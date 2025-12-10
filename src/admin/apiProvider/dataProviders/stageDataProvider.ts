import { format } from "date-fns";
import { DataProvider } from "react-admin";

import {
  fetchPatchV2AdminFundingProgrammeStageUUID,
  fetchPostV2AdminFundingProgrammeStage,
  PatchV2AdminFundingProgrammeStageUUIDError,
  PostV2AdminFundingProgrammeStageError
} from "@/generated/apiComponents";
import { StageRead } from "@/generated/apiSchemas";

import { getFormattedErrorForRA } from "../utils/error";

const normalizeStagePayload = (object: StageRead) => ({
  ...object,
  //@ts-expect-error
  form_id: object.form.uuid,
  deadline_at: object.deadline_at
    ? (() => {
        try {
          return format(new Date(Date.parse(object.deadline_at)), "Y-MM-dd HH:mm:ss");
        } catch (e) {
          return undefined;
        }
      })()
    : undefined
});

export const stageDataProvider: DataProvider = {
  // @ts-expect-error TODO this DataProvider will be removed in the forms epic
  async getList() {},

  // @ts-expect-error TODO this DataProvider will be removed in the forms epic
  async getOne() {},

  async update(_, params) {
    const uuid = params.id as string;

    try {
      const resp = await fetchPatchV2AdminFundingProgrammeStageUUID({
        // @ts-expect-error
        pathParams: { uuid },
        body: normalizeStagePayload(params.data)
      });

      //@ts-ignore
      return { data: { ...resp.data, id: resp.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as PatchV2AdminFundingProgrammeStageUUIDError);
    }
  },

  async create(_, params) {
    try {
      const resp = await fetchPostV2AdminFundingProgrammeStage({ body: normalizeStagePayload(params.data) });

      //@ts-ignore
      return { data: { ...resp.data, id: resp.data.uuid } };
    } catch (err) {
      throw getFormattedErrorForRA(err as PostV2AdminFundingProgrammeStageError);
    }
  }
};
