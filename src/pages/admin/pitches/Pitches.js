import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Button } from 'tsc-chameleon-component-library';
import PanelItem from '../../../components/panelItem/PanelItem';
import LoadingSection from '../../../components/loading/LoadingSection';
import PitchPreview from './PitchesPreviewContainer';
import moment from 'moment';
import { initialAsyncStatePropType } from '../../../redux/asyncActionReducer';
import { Link, Switch, Route, useRouteMatch } from 'react-router-dom';
import { orderByDateDesc } from '../../../helpers';

const PitchesApproval = props => {
    const { t } = useTranslation();
    const { url, path } = useRouteMatch();
    const { getPitchTasks, pitchTasksState, clearPitch, location, clearGetPitchTasks } = props;

    useEffect(() => clearGetPitchTasks, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
      window.scrollTo(0, 0);
      clearPitch();
      setTimeout(() => {
        getPitchTasks();
      }, 250);
    }, [location, clearPitch, clearGetPitchTasks, getPitchTasks]);

    const awaitingApproval = pitchTasksState.data ? orderByDateDesc(pitchTasksState.data, 'updated_at').map(pitch => {
        return (
          <PanelItem key={pitch.id} className="u-flex u-flex--space-between u-flex--break-md u-margin-bottom-small u-flex--centered c-admin__panel-item">
            <div>
              <h3 className="u-text-uppercase u-text-bold u-text-spaced-small u-margin-bottom-none u-margin-horizontal-tiny u-font-grey">
                {pitch.name}
              </h3>
              <div className="u-flex u-flex--break-md">
                {pitch.updated_at !== pitch.created_at &&
                  <p className="u-font-primary u-margin-vertical-none u-margin-horizontal-tiny u-font-grey u-text-uppercase u-text-spaced-small">
                    {t('admin.updated')} <span className="u-text-bold">{moment(pitch.updated_at).format("MM/DD/YYYY")}</span>
                  </p>
                }
                <p className="u-font-primary u-margin-vertical-none u-margin-horizontal-tiny u-font-grey u-text-uppercase u-text-spaced-small">
                  {t('admin.submitted')} <span className="u-text-bold">{moment(pitch.created_at).format("MM/DD/YYYY")}</span>
                </p>
              </div>
            </div>

            <Link to={`${url}/preview/${pitch.id}`} className="c-button c-button--small u-link-button has-icon has-icon--arrow-right c-admin__panel-preview-link">
              {t('admin.pitches.view')}
            </Link>
          </PanelItem>
        );
      }) : [];

    return (
        <section className="c-section c-section--standard-width">
            <h1 className="u-text-uppercase">
                {t('admin.pitches.title')}
            </h1>
            {pitchTasksState.isFetching ? <LoadingSection /> :
              <>
                <Switch>
                  <Route exact path={`${path}`}>
                    <Button click={getPitchTasks} className="c-button--small u-margin-bottom-small">{t('common.refresh')}</Button>
                    <h2 className="u-text-uppercase u-font-normal">{t('admin.awaitingApproval')}</h2>
                    {
                      awaitingApproval.length === 0 ?
                        <p>{t('admin.pitches.nothingToAction')}</p> : awaitingApproval
                    }
                  </Route>
                  <Route path={`${path}/preview/:id`} component={PitchPreview} />
                  <Route path={`${path}/previewVersion/:id`} children={({ ...rest }) => (
                      <PitchPreview isVersionId {...rest}/>
                    )}
                  />
                </Switch>
              </>
            }
        </section>
    );
};

PitchesApproval.propTypes = {
    pitchTasksState: initialAsyncStatePropType.isRequired,
    getPitchTasks: PropTypes.func.isRequired
};

export default PitchesApproval;
