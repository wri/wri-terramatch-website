import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { initialAsyncStatePropType } from '../../../redux/asyncActionReducer';
import { Button } from 'tsc-chameleon-component-library';

import superagent from 'superagent';

import PanelItem from '../../../components/panelItem/PanelItem';

const reports = {
  ORGANISATIONS_ALL_TIME: 'organisations_all_time',
  PITCHES_ALL_TIME: 'pitches_all_time',
  FUNDING_OFFERS_ALL_TIME: 'funding_offers_all_time',
  APPROVED_ORGANISATIONS: 'approved_organisations',
  REJECTED_ORGANISATIONS: 'rejected_organisations',
  USERS: 'users',
  APPROVED_PITCHES: 'approved_pitches',
  REJECTED_PITCHES: 'rejected_pitches',
  INTERESTS: 'interests',
  MATCHES: 'matches'
};

const Reports = (props) => {
  const { t } = useTranslation();
  const [ selectedReport, setSelectedReport ] = useState(null);
  const [ error, setError ] = useState(null);
  const { loginState } = props;

  const downloadReport = (report) => {
    if (!selectedReport && loginState.data) {
      // getReport(report);
      setSelectedReport(report);
      setError(null);
      const token = loginState.data.token
      superagent.get(`${process.env.REACT_APP_API_URL}/reports/${report}`)
      .set('authorization', `bearer ${token}`)
      .then(res => {
        setSelectedReport(null);
        createLinkAndDownload(res, report);
      }).catch((err) => {
        setSelectedReport(null);
        setError('errors.unknown.GENERIC');
      });
    }
  };

  const createLinkAndDownload = (res, report) => {
    const encodedUri = 'data:text/csv;charset=UTF-8,' + encodeURIComponent(`${res.text}`);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);

    const fileName = `${report}_${new Date().toString()}.csv`.replace(/ /g, '-');
    link.setAttribute("download", fileName);

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  };

  const reportsItems = Object.keys(reports).map((key) => {
      const item = reports[key];
      return (
        <PanelItem key={item} className="u-flex u-flex--space-between u-flex--break-md u-margin-bottom-small u-flex--centered c-admin__panel-item">
          <div>
            <h3 className="u-text-uppercase u-text-bold u-text-spaced-small u-margin-bottom-none u-font-grey">
              {t(`admin.reports.${item}`)}
            </h3>
            <p className="u-font-primary u-margin-none u-font-grey u-text-spaced-small">
              {t(`admin.reports.${item}Help`)}
            </p>
          </div>
          <Button click={() => downloadReport(item)} disabled={selectedReport === item} className="c-button--small">
            {selectedReport === item ? t('admin.reports.downloadingCSV') : t('admin.reports.downloadCSV')}
          </Button>
        </PanelItem>
      );
    });

  return (
    <section className="c-section c-section--standard-width">
      <h1 className="u-padding-bottom-small u-text-uppercase">{t('admin.reports.title')}</h1>
      { error && <p className="u-text-error">{t(error)}</p>}
      {reportsItems}
    </section>)
};

Reports.propTypes = {
  loginState: initialAsyncStatePropType.isRequired
};

export default Reports;
