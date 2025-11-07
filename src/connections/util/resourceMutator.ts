import {
  CreateConnection,
  DataConnection,
  LoadFailureConnection,
  UpdateConnection
} from "@/connections/util/apiConnectionFactory";
import ApiSlice, { ApiDataStore } from "@/store/apiSlice";
import { Connection, OptionalProps } from "@/types/connection";
import { connectionInState, loadConnection } from "@/utils/loadConnection";

const startedCreatingPredicate = <DTO, CreateAttributes, PType extends OptionalProps>(
  connection: Connection<CreateConnection<DTO, CreateAttributes>, PType>,
  props: PType
) => {
  const { selector } = connection;
  return (state: ApiDataStore) => selector(state, props).isCreating;
};

const stoppedCreatingPredicate = <DTO, CreateAttributes, PType extends OptionalProps>(
  connection: Connection<CreateConnection<DTO, CreateAttributes>, PType>,
  props: PType
) => {
  const { selector } = connection;
  return (state: ApiDataStore) => !selector(state, props).isCreating;
};

const startedUpdatingPredicate = <UpdateAttributes, PType extends OptionalProps>(
  connection: Connection<LoadFailureConnection & UpdateConnection<UpdateAttributes>, PType>,
  props: PType
) => {
  const { selector } = connection;
  return (state: ApiDataStore) => selector(state, props).isUpdating;
};

const stoppedUpdatingPredicate = <UpdateAttributes, PType extends OptionalProps>(
  connection: Connection<LoadFailureConnection & UpdateConnection<UpdateAttributes>, PType>,
  props: PType
) => {
  const { selector } = connection;
  return (state: ApiDataStore) => !selector(state, props).isUpdating;
};

/**
 * Generates a resource creator for the given connection. The resource creator is an async method that
 * takes in the create attributes defined on the connection and will either throw the resulting
 * creation failure, or will return the resulting data.
 *
 * This method should only be used in places other than components, where hooks can be used. In
 * components, use the connectionHook instead.
 */
export const resourceCreator =
  <DTO, CreateAttributes, PType extends OptionalProps>(
    connection: Connection<CreateConnection<DTO, CreateAttributes>, PType>,
    props: PType = {} as PType
  ) =>
  async (attributes: CreateAttributes) => {
    const { create } = await loadConnection(connection, props);
    create(attributes);

    await connectionInState(startedCreatingPredicate(connection, props), connection, props);
    await connectionInState(stoppedCreatingPredicate(connection, props), connection, props);

    const { data, createFailure } = connection.selector(ApiSlice.currentState, props);
    if (createFailure != null) throw createFailure;
    return data!;
  };

/**
 * Generates a resource updater for the given connection. The resource updater is an async method that
 * takes in the update attributes defined on the connection and will either throw the resulting
 * update failure, or will return the resulting data.
 *
 * This method should only be used in places other than components, where hooks can be used. In
 * components, use the connectionHook instead.
 */
export const resourceUpdater =
  <DTO, UpdateAttributes, PType extends OptionalProps>(
    connection: Connection<DataConnection<DTO> & LoadFailureConnection & UpdateConnection<UpdateAttributes>, PType>
  ) =>
  async (attributes: UpdateAttributes, props: PType = {} as PType) => {
    const { update } = await loadConnection(connection, props);
    update(attributes);

    await connectionInState(startedUpdatingPredicate(connection, props), connection, props);
    await connectionInState(stoppedUpdatingPredicate(connection, props), connection, props);

    const { data, updateFailure } = connection.selector(ApiSlice.currentState, props);
    if (updateFailure != null) throw updateFailure;
    return data!;
  };
