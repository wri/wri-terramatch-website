import { ApiConnectionFactory } from "@/connections/util/apiConnectionFactory";
import {
  getTreeRestorationGoal,
  GetTreeRestorationGoalQueryParams,
  GetTreeRestorationGoalVariables
} from "@/generated/v3/dashboardService/dashboardServiceComponents";
import { TreeRestorationGoalDto } from "@/generated/v3/dashboardService/dashboardServiceSchemas";
import { getTreeRestorationGoalFetchFailed } from "@/generated/v3/dashboardService/dashboardServiceSelectors";
import { connectionHook } from "@/utils/connectionShortcuts";

const treeRestorationGoalConnection = ApiConnectionFactory.singleByFilter<
  TreeRestorationGoalDto,
  GetTreeRestorationGoalVariables,
  GetTreeRestorationGoalQueryParams
>("treeRestorationGoals", getTreeRestorationGoal)
  .loadFailure(getTreeRestorationGoalFetchFailed)
  .buildConnection();

export const useTreeRestorationGoal = connectionHook(treeRestorationGoalConnection);
