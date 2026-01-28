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

const actionsSelector = (store: ApiDataStore) => store.actions;

const actionsConnectionSelector = createSelector(
  [actionsSelector, actionsIndex.isFetchingSelector({} as never), actionsIndex.fetchFailedSelector({} as never)],
  (resources, isLoading, loadFailure): ActionsConnection => ({
    data:
      resources != null && Object.keys(resources).length > 0
        ? Object.values(resources).map(r => r.attributes as ActionDto)
        : undefined,
    isLoading: isLoading ?? false,
    loadFailure
  })
);

const actionsConnection: Connection<ActionsConnection> = {
  selector: actionsConnectionSelector,
  isLoaded: ({ data, loadFailure }) => data != null || loadFailure != null,
  load: selected => {
    if (!selected.isLoading && selected.loadFailure == null && selected.data == null) {
      actionsIndex.fetch({});
    }
  }
};

export const useActions = connectionHook(actionsConnection);
export const loadActions = connectionLoader(actionsConnection);
