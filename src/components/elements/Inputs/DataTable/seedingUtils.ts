export type SeedingEntry = {
  uuid?: string | null;
  name?: string | null;
  amount?: number | string | null;
  seedsInSample?: number | string | null;
  weightOfSample?: number | string | null;
};

export const getSeedsPerKg = (seeding: Pick<SeedingEntry, "seedsInSample" | "weightOfSample">): string | null => {
  if (
    seeding.seedsInSample == null ||
    seeding.seedsInSample === "" ||
    seeding.weightOfSample == null ||
    seeding.weightOfSample === ""
  ) {
    return null;
  }

  const seedsInSample = Number(seeding.seedsInSample);
  const weightOfSample = Number(seeding.weightOfSample);
  if (!Number.isFinite(seedsInSample) || !Number.isFinite(weightOfSample) || weightOfSample === 0) {
    return null;
  }

  return (seedsInSample / weightOfSample).toFixed(2);
};
