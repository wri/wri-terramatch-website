import { v3Resource } from "@/connections/util/apiConnectionFactory";
import { connectionHook } from "@/connections/util/connectionShortcuts";
import {
  getTreeRestorationGoal,
  GetTreeRestorationGoalQueryParams
} from "@/generated/v3/dashboardService/dashboardServiceComponents";
import { TreeRestorationGoalDto } from "@/generated/v3/dashboardService/dashboardServiceSchemas";

const treeRestorationGoalConnection = v3Resource("treeRestorationGoals", getTreeRestorationGoal)
  .singleByFilter<TreeRestorationGoalDto, GetTreeRestorationGoalQueryParams>()
  .buildConnection();

export const useTreeRestorationGoal = connectionHook(treeRestorationGoalConnection);
