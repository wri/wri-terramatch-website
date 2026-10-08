import type { NurseryIndexProjectSection, NurseryIndexRow } from "./nurseryIndex.types";
import { filterNurseryProjectSections } from "./nurseryIndex.utils";

const createNursery = (
  id: string,
  status: NurseryIndexRow["status"],
  updateRequestStatus: NurseryIndexRow["updateRequestStatus"]
) =>
  ({
    id,
    uuid: id,
    name: id,
    status,
    updateRequestStatus
  } as NurseryIndexRow);

const createSection = (nurseries: NurseryIndexRow[]) =>
  ({
    id: "project-1",
    projectUuid: "project-1",
    projectName: "Project One",
    organisationName: "Organisation One",
    frameworkKey: "terrafund",
    seedlingsGrown: { progress: 0, goal: 0 },
    nurseries
  } as NurseryIndexProjectSection);

describe("filterNurseryProjectSections", () => {
  it("does not include approved nurseries in the pending approval status filter", () => {
    const pendingNursery = createNursery("pending", "pending-approval", null);
    const approvedNurseryWithPendingUpdate = createNursery("approved", "approved", "pending-approval");

    const result = filterNurseryProjectSections(
      [createSection([pendingNursery, approvedNurseryWithPendingUpdate])],
      "",
      undefined,
      ["pending-approval"]
    );

    expect(result[0]?.nurseries).toEqual([pendingNursery]);
  });

  it("supports selecting multiple update statuses", () => {
    const draftUpdate = createNursery("draft-update", "approved", "draft");
    const pendingUpdate = createNursery("pending-update", "approved", "pending-approval");
    const completedUpdate = createNursery("completed-update", "approved", "approved");

    const result = filterNurseryProjectSections(
      [createSection([draftUpdate, pendingUpdate, completedUpdate])],
      "",
      undefined,
      [],
      ["draft", "pending-approval"]
    );

    expect(result[0]?.nurseries).toEqual([draftUpdate, pendingUpdate]);
  });
});
