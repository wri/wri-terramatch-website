import { ALL_TF, Framework } from "@/context/framework.provider";

export const SUMMARY_ANR_ROLLUP_HIDE: readonly Framework[] = [Framework.PPC, Framework.HBF];

export const SUMMARY_REPLANTING_ROLLUP_HIDE: readonly Framework[] = [Framework.PPC, Framework.HBF];

export const SUMMARY_INVASIVE_ROLLUP_HIDE: readonly Framework[] = [
  Framework.PPC,
  Framework.HBF,
  ...ALL_TF,
  Framework.FF_1
];
