import { createSelector } from "reselect";

import {
  getTreeRestorationGoal,
  GetTreeRestorationGoalQueryParams
} from "@/generated/v3/dashboardService/dashboardServiceComponents";
import { getTreeRestorationGoalFetchFailed } from "@/generated/v3/dashboardService/dashboardServiceSelectors";
import { getStableQuery } from "@/generated/v3/utils";
import ApiSlice, { ApiDataStore, PendingErrorState } from "@/store/apiSlice";
import { Connection } from "@/types/connection";
import { connectionHook, connectionLoader } from "@/utils/connectionShortcuts";
import { selectorCache } from "@/utils/selectorCache";

import { TreeRestorationGoalDto } from "../generated/v3/dashboardService/dashboardServiceSchemas";

export type TreeRestorationGoalConnectionProps = Partial<GetTreeRestorationGoalQueryParams>;

export type TreeRestorationGoalConnection = {
  data?: TreeRestorationGoalDto;
  fetchFailure?: PendingErrorState | null;
  refetch: () => void;
};

const treeRestorationGoalIsLoaded = (connection: TreeRestorationGoalConnection) =>
  connection.data != null || connection.fetchFailure != null;

const indexCacheKey = (props: TreeRestorationGoalConnectionProps) =>
  getStableQuery(props as GetTreeRestorationGoalQueryParams);

const treeRestorationGoalConnection: Connection<TreeRestorationGoalConnection, TreeRestorationGoalConnectionProps> = {
  load: (connection, props) => {
    if (!treeRestorationGoalIsLoaded(connection)) {
      getTreeRestorationGoal({ queryParams: props });
    }
  },

  isLoaded: treeRestorationGoalIsLoaded,

  selector: selectorCache(
    props => indexCacheKey(props)?.replace(/%5B%5D/g, ""),
    props =>
      createSelector(
        [
          (store: ApiDataStore) =>
            store.treeRestorationGoals?.[indexCacheKey(props)?.replace(/%5B%5D/g, "")]?.attributes,
          getTreeRestorationGoalFetchFailed({ queryParams: props })
        ],
        (indexMeta, fetchFailure) => {
          const refetch = () => ApiSlice.pruneIndex("treeRestorationGoals", "");
          if (indexMeta == null) return { refetch, fetchFailure };

          return {
            data: indexMeta as TreeRestorationGoalDto,
            fetchFailure,
            refetch
          };
        }
      )
  )
};

export const loadTreeRestorationGoal = connectionLoader(treeRestorationGoalConnection);
export const useTreeRestorationGoal = connectionHook(treeRestorationGoalConnection);
