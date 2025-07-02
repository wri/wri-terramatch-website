import { ApiConnectionFactory } from "@/connections/util/apiConnectionFactory";
import { connectionHook } from "@/connections/util/connectionShortcuts";
import {
  getTreeRestorationGoal,
  GetTreeRestorationGoalQueryParams,
  GetTreeRestorationGoalVariables
} from "@/generated/v3/dashboardService/dashboardServiceComponents";
import { TreeRestorationGoalDto } from "@/generated/v3/dashboardService/dashboardServiceSchemas";
import { getTreeRestorationGoalFetchFailed } from "@/generated/v3/dashboardService/dashboardServiceSelectors";

const treeRestorationGoalConnection = ApiConnectionFactory.singleByFilter<
  TreeRestorationGoalDto,
  GetTreeRestorationGoalVariables,
  GetTreeRestorationGoalQueryParams
>("treeRestorationGoals", getTreeRestorationGoal)
  .loadFailure(getTreeRestorationGoalFetchFailed)
  .buildConnection();

export const useTreeRestorationGoal = connectionHook(treeRestorationGoalConnection);
