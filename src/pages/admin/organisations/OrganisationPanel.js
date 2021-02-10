import React from 'react';
import PropTypes from 'prop-types';
import PanelItem from '../../../components/panelItem/PanelItem';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { Link } from 'react-router-dom';

const OrganisationPanel = (props) => {
  const { organisation, link } = props;
  const { t } = useTranslation();

  return (
    <PanelItem className="u-flex u-flex--space-between u-flex--break-md u-margin-bottom-small u-flex--centered c-admin__panel-item">
      <div>
        <h3 className="u-text-uppercase u-text-bold u-text-spaced-small u-margin-bottom-none u-margin-horizontal-tiny u-font-grey">
          {organisation.name}
        </h3>
        <div className="u-flex u-flex--break-md">
          {organisation.updated_at !== organisation.created_at &&
            <p className="u-font-primary u-margin-vertical-none u-margin-horizontal-tiny u-font-grey u-text-uppercase u-text-spaced-small">
              {t('admin.updated')} <span className="u-text-bold">{moment(organisation.updated_at).format("MM/DD/YYYY")}</span>
            </p>
          }
          <p className="u-font-primary u-margin-vertical-none u-margin-horizontal-tiny u-font-grey u-text-uppercase u-text-spaced-small">
            {t('admin.submitted')} <span className="u-text-bold">{moment(organisation.created_at).format("MM/DD/YYYY")}</span>
          </p>
        </div>
      </div>

      <Link to={link} className="c-button c-button--small u-link-button has-icon has-icon--arrow-right c-admin__panel-preview-link">{t('admin.organisations.view')}</Link>
    </PanelItem>
  );
};

OrganisationPanel.propTypes = {
  organisation: PropTypes.object.isRequired,
  link: PropTypes.string.isRequired
};

export default OrganisationPanel;
