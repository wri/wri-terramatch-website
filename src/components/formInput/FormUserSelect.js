import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import TeamMemberList from '../memberList/MemberList';
import { initialAsyncStatePropType } from '../../redux/asyncActionReducer';

const FormUserSelect = (props) => {
  const { onChange,
    value,
    getTeamMembers,
    teamMembersState,
    clearState,
    meState
  } = props;

  const [ selectedOptions, setSelectedOptions ] = useState(value ? value : []);
  const { t } = useTranslation();

  useEffect(() => {
    return () => {
      clearState();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (meState.data) {
      if (!teamMembersState.isFetching && !teamMembersState.data && !teamMembersState.error) {
        getTeamMembers(meState.data.organisation_id);
      }
    }
  }, [getTeamMembers, meState.data, teamMembersState]);

  const valueChange = (value) => {
    const values = [...selectedOptions];
    const index = values.findIndex(option => value.id === option.id);

    if (index > -1) {
      values.splice(index, 1);
    } else {
      values.push(value);
    }
    // If already in, remove it, else add it.
    onChange({value: values});
    setSelectedOptions(values);
  };

  const users = teamMembersState.data ?
    <TeamMemberList
      users={teamMembersState.data}
      isCard
      isSelectable
      isCompact
      selectChange={valueChange}
      selectedUsers={selectedOptions}
      hideUnverified
    /> : null;

  if (teamMembersState.isFetching) {
    return <p>{t('common.loadingOptions')}</p>
  }

  return (
    <div className="c-form__user-select">
      {users}
    </div>
  );
};

FormUserSelect.propTypes = {
  onChange: PropTypes.func.isRequired,
  getTeamMembers: PropTypes.func.isRequired,
  teamMembersState: initialAsyncStatePropType.isRequired,
  meState: initialAsyncStatePropType.isRequired
};

export default FormUserSelect;
