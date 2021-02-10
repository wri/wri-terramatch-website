import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { Switch, Route } from 'react-router-dom';
import { useRouteMatch } from  'react-router-dom';
import OrganisationPreview from './OrganisationPreviewContainer';
import { initialAsyncStatePropType } from '../../../redux/asyncActionReducer';
import { Button } from 'tsc-chameleon-component-library';
import { orderByDateDesc } from '../../../helpers';
import OrganisationPanel from './OrganisationPanel';
import LoadingSection from '../../../components/loading/LoadingSection';

const OrganisationApproval = (props) => {
  const { t } = useTranslation();
  const { url, path } = useRouteMatch();
  const { getOrganisationTasks,
          organisationTasksState,
          clearOrganisation,
          location,
          clearOrganisationTasks,
          getOrganisations,
          organisationsState,
          clearGetOrganisations
        } = props;
  const [ searchedOrgs, setSearchedOrgs] = useState([]);
  const [ awaitingApproval, setAwaitingApproval ] = useState([]);
  const [ search, setSearch ] = useState('');

  useEffect(() => {
    return () => {
      clearOrganisationTasks();
      clearGetOrganisations();
    }}, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.scrollTo(0, 0);
    clearOrganisation();
    setTimeout(() => {
      getOrganisationTasks();
      getOrganisations();
    }, 250);
  }, [location, clearOrganisation, getOrganisationTasks, getOrganisations]);

  useEffect(() => {
    setAwaitingApproval(organisationTasksState.data ? orderByDateDesc(organisationTasksState.data, 'updated_at').map((org) => {
      return (<OrganisationPanel link={`${url}/preview/${org.id}`} organisation={org} key={org.id} />);
    }) : []);
  }, [organisationTasksState.data, url]);

  useEffect(() => {
    if (organisationTasksState.data && organisationsState.data) {
      const newOrgs = [];
      const ordered = orderByDateDesc(organisationsState.data, 'updated_at');

      ordered.forEach((org) => {
        if (!organisationTasksState.data.find(task => task.id === org.id) &&
            org.name.toLowerCase().includes(search.toLowerCase())) {
          newOrgs.push(<OrganisationPanel link={`/organization/${org.id}`} organisation={org} key={org.id} />);
        }
      });

      setSearchedOrgs(newOrgs);
    }
  }, [organisationTasksState.data, organisationsState.data, search]);

  return (
    <section className="c-section c-section--standard-width">
      <h1 className="u-text-uppercase">{t('admin.organisations.title')}</h1>
      {organisationTasksState.isFetching || organisationsState.isFetching ? <LoadingSection /> :
        <>
          <Switch>
            <Route exact path={`${path}`}>
              <Button click={() => {
                  getOrganisationTasks();
                  getOrganisations();
              }} className="c-button--small u-margin-bottom-small">{t('common.refresh')}</Button>
              <div className="u-flex u-flex--break-md u-flex--space-between">
                <h2 className="u-text-uppercase u-font-normal">{t('admin.awaitingApproval')}</h2>
                <p className="u-text-uppercase u-font-medium u-font-primary">{t('admin.organisationsCount', {count: awaitingApproval.length})}</p>
              </div>
              { awaitingApproval.length === 0 ?
                <p>{t('admin.organisations.nothingToAction')}</p> : awaitingApproval
              }
              <hr className="u-margin-top-large"/>

                <div className="u-flex u-flex--break-md u-flex--space-between">
                  <h2 className="u-text-uppercase u-font-normal">{t('admin.approvedOrganisations')}</h2>
                  <p className="u-text-uppercase u-font-medium u-font-primary">{t('admin.organisationsCount', {count: searchedOrgs.length})}</p>
                </div>
                <div className="u-margin-bottom-small">
                  <label htmlFor="search" className="u-visually-hidden">{t('admin.organisations.search')}</label>
                  <input
                    id="search"
                    type="text"
                    value={search}
                    onChange={(e)=> setSearch(e.target.value)}
                    className="c-form__input u-width-100 c-form__input--large c-form__input--primary u-margin-bottom-small"
                    placeholder={t('admin.organisations.search')}
                    autoComplete="off"
                  />
                </div>
                {searchedOrgs.length === 0 ? <p>{t('admin.organisations.noOrganisations')}</p> : searchedOrgs }
            </Route>
            <Route path={`${path}/preview/:id`} component={OrganisationPreview} />
            <Route path={`${path}/previewVersion/:id`} children={({ ...rest }) => (
                <OrganisationPreview isVersionId {...rest}/>
              )}
            />
          </Switch>
        </>
      }
    </section>);
};

OrganisationApproval.propTypes = {
  organisationTasksState: initialAsyncStatePropType.isRequired,
  getOrganisationTasks: PropTypes.func.isRequired
};

export default OrganisationApproval;
