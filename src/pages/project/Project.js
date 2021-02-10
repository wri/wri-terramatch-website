import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { initialAsyncStatePropType } from '../../redux/asyncActionReducer';
import ProjectComponent from '../../components/project/ProjectContainer';
import { useTranslation } from 'react-i18next';
import { getLatestVersion, canFetch } from '../../helpers';

const Project = (props) => {
  const {
    getPitchVersions,
    getPitchVersionsState,
    getPitchState,
    getPitch,
    showNotificationBar,
    closeNotificationBar,
    clearState
  } = props;

  const [ project, setProject ] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    return clearState;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (canFetch(getPitchVersionsState)) {
      getPitchVersions(props.match.params.id);
    }
    if (canFetch(getPitchState) && getPitchVersionsState.error) {
      getPitch(props.match.params.id);
    }
  }, [getPitchVersionsState, getPitchVersions, props.match.params.id, getPitchState, getPitch]);

  useEffect(() => {
    if (getPitchVersionsState.data && !getPitchVersionsState.isFetching) {
      const pitch = getLatestVersion(getPitchVersionsState);
      const isCompleted = !!pitch.data.completed_at
      const isPending = pitch.status === 'pending' && !isCompleted;
      const isRejected = pitch.status === 'rejected' && !isCompleted;

      setProject(pitch);

      if (isPending) {
        showNotificationBar('project.awaitingApprovalMessage', 'project.awaitingApproval');
      } else if (isRejected) {
        showNotificationBar('project.rejectedMessage', 'project.rejected', {reason: `${t(`api.rejected_reasons.${pitch.rejected_reason}`)}: ${pitch.rejected_reason_body}`});
      }

      return () => {
        closeNotificationBar();
      };
    }

    if (getPitchState.data && !getPitchState.isFetching && getPitchVersionsState.error) {
      setProject(getPitchState);
    }
  }, [getPitchVersionsState, getPitchState, setProject, showNotificationBar, closeNotificationBar, t]);

  return (
    <ProjectComponent project={project} />
  )
}

Project.propTypes = {
  meState: initialAsyncStatePropType.isRequired,
  getPitchVersionsState: initialAsyncStatePropType.isRequired,
  getPitchVersions: PropTypes.func.isRequired
};

export default Project;
