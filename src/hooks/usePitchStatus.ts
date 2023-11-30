import _ from "lodash";

import { ProjectPitchRead } from "@/generated/apiSchemas";

export const usePitchStatus = (pitches?: ProjectPitchRead[]) => {
  if (!pitches || pitches?.length === 0) {
    return "empty";
  }

  if (pitches && pitches?.length > 0) {
    for (const pitch of pitches) {
      _.unset(pitch, "deleted_at");
      _.unset(pitch, "tags");
      _.unset(pitch, "funding_programme");

      for (const [, value] of Object.entries(pitch)) {
        if (!value || (Array.isArray(value) && value.length === 0)) {
          return "incomplete";
        }
      }
    }
  }

  return "complete";
};
