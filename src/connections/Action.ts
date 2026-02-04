import { createSelector } from "reselect";

import { useLogin } from "@/connections/Login";
import { connectionLoader } from "@/connections/util/connectionShortcuts";
import { actionsIndex } from "@/generated/v3/userService/userServiceComponents";
import { ActionDto } from "@/generated/v3/userService/userServiceSchemas";
import { useConnection } from "@/hooks/useConnection";
import { useValueChanged } from "@/hooks/useValueChanged";
import { ApiDataStore, PendingError } from "@/store/apiSlice";
import { Connection } from "@/types/connection";

type ActionsConnectionState = {
  data: ActionDto[];
  isLoading: boolean;
  loadFailure: PendingError | undefined;
};

export type UseActionsProps = { enabled?: boolean };

type ActionsConnection = ActionsConnectionState;

const actionsSelector = (store: ApiDataStore) => store.actions;

const actionsConnectionSelector = createSelector(
  [actionsSelector, actionsIndex.isFetchingSelector({} as never), actionsIndex.fetchFailedSelector({} as never)],
  (resources, isLoading, loadFailure): ActionsConnection => ({
    data: resources ? Object.values(resources).map(r => r.attributes as ActionDto) : [],
    isLoading: isLoading ?? false,
    loadFailure
  })
);

const actionsConnection: Connection<ActionsConnection, UseActionsProps> = {
  selector: (state, _props) => actionsConnectionSelector(state)
};

export type UseActionsReturn = readonly [boolean, ActionsConnectionState];

export const useActions = (props: UseActionsProps = {}): UseActionsReturn => {
  const connection = useConnection(actionsConnection, props);
  const [, { data: login }] = useLogin({});

  useValueChanged(login, () => {
    if (login != null && props?.enabled !== false) actionsIndex.fetch({});
  });

  if (login == null) return [false, { data: [], isLoading: false, loadFailure: undefined }];
  return connection as UseActionsReturn;
};

export const loadActions = connectionLoader(actionsConnection);
