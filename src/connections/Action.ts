import { createSelector } from "reselect";

import { connectionHook, connectionLoader } from "@/connections/util/connectionShortcuts";
import { actionsIndex } from "@/generated/v3/userService/userServiceComponents";
import { ActionDto } from "@/generated/v3/userService/userServiceSchemas";
import { ApiDataStore, PendingError } from "@/store/apiSlice";
import { Connection } from "@/types/connection";

type ActionsConnection = {
  data?: ActionDto[];
  isLoading: boolean;
  loadFailure: PendingError | undefined;
};

export type UseActionsProps = { enabled?: boolean };

const actionsSelector = (store: ApiDataStore) => store.actions;

const actionsConnectionSelector = createSelector(
  [actionsSelector, actionsIndex.isFetchingSelector({} as never), actionsIndex.fetchFailedSelector({} as never)],
  (resources, isLoading, loadFailure): ActionsConnection => ({
    data:
      resources == null
        ? undefined
        : Object.keys(resources).length > 0
        ? Object.values(resources).map(r => r.attributes as ActionDto)
        : [],
    isLoading: isLoading ?? false,
    loadFailure
  })
);

const actionsConnection: Connection<ActionsConnection, UseActionsProps> = {
  selector: (state, _props) => actionsConnectionSelector(state),
  isLoaded: (selected, props) => props?.enabled === false || selected.data != null || selected.loadFailure != null,
  load: (selected, props) => {
    if (props?.enabled === false) return;
    if (!selected.isLoading && selected.loadFailure == null && selected.data == null) {
      actionsIndex.fetch({});
    }
  }
};

export const useActions = connectionHook(actionsConnection);
export const loadActions = connectionLoader(actionsConnection);
